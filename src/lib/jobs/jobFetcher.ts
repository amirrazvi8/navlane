import * as cheerio from 'cheerio';
import axios from 'axios';

export interface IJobListing {
  externalId: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  url: string;
  source: string;
  tags: string[];
  description: string;
  postedAt: string;
}

// Realistic browser headers to avoid basic bot detection
const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
};

const HTTP_TIMEOUT_MS = 60_000;

// ═══════════════════════════════════════════════════════════════════════════
// 1. LINKEDIN — Public Guest Jobs Endpoint
// ═══════════════════════════════════════════════════════════════════════════
// LinkedIn serves job listings to non-logged-in visitors via a guest endpoint
// that returns HTML fragments. This is the most reliable scraping target.

async function scrapeLinkedIn(
  query: string,
  location: string = '',
): Promise<IJobListing[]> {
  try {
    const url = new URL(
      'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search',
    );
    url.searchParams.set('keywords', query);
    if (location) {
      url.searchParams.set('location', location);
    }
    url.searchParams.set('start', '0');
    url.searchParams.set('f_TPR', 'r604800');

    const response = await axios.get(url.toString(), {
      headers: {
        ...BROWSER_HEADERS,
        Referer: 'https://www.linkedin.com/jobs/search',
      },
      timeout: HTTP_TIMEOUT_MS,
    });

    const html = response.data;
    if (!html || html.length < 100) return [];

    const $ = cheerio.load(html);
    const jobs: IJobListing[] = [];

    $('li').each((i, el) => {
      if (i >= 15) return false;

      const title =
        $(el).find('.base-search-card__title').text().trim() ||
        $(el).find('h3').text().trim();
      const company =
        $(el).find('.base-search-card__subtitle').text().trim() ||
        $(el).find('h4').text().trim();
      const jobLocation = $(el)
        .find('.job-search-card__location')
        .text()
        .trim();
      const link =
        $(el).find('a.base-card__full-link').attr('href') ||
        $(el).find('a').first().attr('href') ||
        '#';
      const postedAt =
        $(el).find('.job-search-card__listdate, time').attr('datetime') ||
        $(el).find('.job-search-card__listdate, time').text().trim();

      if (title && company) {
        jobs.push({
          externalId: `linkedin-${Buffer.from(title + company)
            .toString('base64')
            .slice(0, 20)}`,
          title,
          company,
          location: jobLocation || 'Not specified',
          salary: 'Not disclosed',
          url: link.startsWith('http')
            ? link
            : `https://www.linkedin.com${link}`,
          source: 'LinkedIn',
          tags: [],
          description: '',
          postedAt: formatRelativeDate(postedAt),
        });
      }
    });

    console.log(`[LinkedIn] Scraped ${jobs.length} jobs`);
    return jobs;
  } catch (error: any) {
    const status = error?.response?.status;
    console.error(
      `[LinkedIn] Scrape error (HTTP ${status || 'N/A'}):`,
      error?.message || error,
    );
    return [];
  }
}

async function fetchFromJSearch(
  query: string,
  location: string = '',
  options: { country?: string; numPages?: number; datePosted?: string } = {},
): Promise<IJobListing[]> {
  const apiKey = process.env.RAPID_API_KEY || '';
  const apiHost = process.env.RAPID_API_HOST || 'jsearch.p.rapidapi.com';

  if (!apiKey) {
    console.warn(
      '[JSearch] RAPID_API_KEY not set — skipping. Add RAPID_API_KEY to .env for Indeed/Naukri/Glassdoor jobs.',
    );
    return [];
  }

  try {
    const searchQuery = location
      ? `${query} jobs in ${location}`
      : `${query} jobs`;

    const response = await axios.request({
      method: 'GET',
      url: `https://${apiHost}/search-v2`,
      params: {
        query: searchQuery,
        num_pages: String(options.numPages || 1),
        date_posted: options.datePosted || 'week',
        ...(options.country ? { country: options.country } : {}),
      },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost,
        'Content-Type': 'application/json',
      },
      timeout: HTTP_TIMEOUT_MS,
    });

    const data = response.data;
    let jobs: any[] = [];
    if (Array.isArray(data?.data)) {
      jobs = data.data;
    } else if (Array.isArray(data)) {
      jobs = data;
    } else if (Array.isArray(data?.jobs)) {
      jobs = data.jobs;
    }

    console.log(
      `[JSearch] API returned ${jobs.length} raw jobs for query: "${searchQuery}"`,
    );

    return jobs.map((job) => ({
      externalId: `jsearch-${job.job_id || Math.random().toString(36).slice(2)}`,
      title: job.job_title || 'Untitled',
      company: job.employer_name || 'Unknown',
      location: formatJSearchLocation(job),
      salary: formatJSearchSalary(job),
      url: job.job_apply_link || job.job_google_link || '#',
      source: job.job_publisher || 'Google Jobs',
      tags: extractJSearchTags(job),
      description: (job.job_description || '').slice(0, 500),
      postedAt: formatRelativeDate(job.job_posted_at_datetime_utc),
    }));
  } catch (error: any) {
    const status = error?.response?.status;
    const errMsg = error?.response?.data?.message || error?.message || error;
    if (status === 403 || status === 401) {
      console.error(
        `[JSearch] Auth error (HTTP ${status}): Invalid or expired RAPID_API_KEY.`,
        errMsg,
      );
    } else if (status === 429) {
      console.error('[JSearch] Rate limit exceeded (HTTP 429).', errMsg);
    } else {
      console.error(`[JSearch] Fetch error (HTTP ${status || 'N/A'}):`, errMsg);
    }
    return [];
  }
}

async function fetchIndiaJobs(
  query: string,
  location: string = '',
): Promise<IJobListing[]> {
  const apiKey = process.env.RAPID_API_KEY || process.env.RAPIDAPI_KEY;
  if (!apiKey) return []; 
  const indiaKeywords = [
    'india',
    'delhi',
    'mumbai',
    'bangalore',
    'bengaluru',
    'hyderabad',
    'chennai',
    'pune',
    'noida',
    'gurgaon',
    'gurugram',
    'kolkata',
    'ahmedabad',
    'jaipur',
    'lucknow',
    'chandigarh',
    'kochi',
    'remote',
  ];
  const isIndiaRelevant =
    !location ||
    indiaKeywords.some((kw) => location.toLowerCase().includes(kw));

  if (!isIndiaRelevant) return [];

  return fetchFromJSearch(query, location || 'India', {
    country: 'IN',
    numPages: 1,
  });
}

function formatJSearchLocation(job: any): string {
  const parts = [job.job_city, job.job_state, job.job_country].filter(Boolean);
  const location = parts.join(', ') || 'Not specified';
  if (job.job_is_remote) return `${location} (Remote)`;
  return location;
}

function formatJSearchSalary(job: any): string {
  const min = job.job_min_salary;
  const max = job.job_max_salary;
  const currency = job.job_salary_currency || 'USD';
  const period = job.job_salary_period || 'YEAR';

  if (min && max) {
    return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}/${period.toLowerCase()}`;
  }
  if (min)
    return `From ${formatCurrency(min, currency)}/${period.toLowerCase()}`;
  if (max)
    return `Up to ${formatCurrency(max, currency)}/${period.toLowerCase()}`;
  return 'Not disclosed';
}

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function extractJSearchTags(job: any): string[] {
  const tags: string[] = [];
  if (job.job_required_skills) {
    tags.push(
      ...(Array.isArray(job.job_required_skills)
        ? job.job_required_skills
        : []),
    );
  }
  const highlights = job.job_highlights;
  if (highlights?.Qualifications) {
    const qualText = highlights.Qualifications.join(' ');
    const techKeywords = [
      'React',
      'Next.js',
      'Node.js',
      'TypeScript',
      'JavaScript',
      'Python',
      'Django',
      'Flask',
      'Java',
      'Spring',
      'AWS',
      'Azure',
      'GCP',
      'Docker',
      'Kubernetes',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'GraphQL',
      'REST',
      'Git',
      'CI/CD',
      'TensorFlow',
      'PyTorch',
      'ML',
      'AI',
      'Machine Learning',
      'Go',
      'Rust',
      'C++',
      'C#',
      '.NET',
      'PHP',
      'Angular',
      'Vue.js',
      'Svelte',
      'Tailwind',
      'CSS',
      'HTML',
      'SQL',
      'Figma',
      'Terraform',
      'Linux',
      'Microservices',
    ];
    for (const kw of techKeywords) {
      if (
        qualText.toLowerCase().includes(kw.toLowerCase()) &&
        !tags.includes(kw)
      ) {
        tags.push(kw);
      }
    }
  }
  return tags.slice(0, 8);
}

async function scrapeWellfound(
  query: string,
  location: string = '',
): Promise<IJobListing[]> {
  try {
    const url = new URL('https://wellfound.com/jobs');
    const combinedQuery = location ? `${query} ${location}` : query;
    url.searchParams.set('query', combinedQuery);

    const response = await axios.get(url.toString(), {
      headers: {
        ...BROWSER_HEADERS,
        Referer: 'https://wellfound.com/',
      },
      timeout: HTTP_TIMEOUT_MS,
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const jobs: IJobListing[] = [];

    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html() || '{}');
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item['@type'] === 'JobPosting' && jobs.length < 15) {
            jobs.push({
              externalId: `wellfound-${Buffer.from(
                item.title + (item.hiringOrganization?.name || ''),
              )
                .toString('base64')
                .slice(0, 20)}`,
              title: item.title || 'Untitled',
              company: item.hiringOrganization?.name || 'Unknown',
              location: item.jobLocation?.address?.addressLocality || 'Remote',
              salary: 'Not disclosed',
              url: item.url || 'https://wellfound.com/jobs',
              source: 'Wellfound',
              tags: [],
              description: stripHtml(item.description || '').slice(0, 500),
              postedAt: formatRelativeDate(item.datePosted),
            });
          }
        }
      } catch {}
    });

    if (jobs.length === 0) {
      const nextDataScript = $('#__NEXT_DATA__').html();
      if (nextDataScript) {
        try {
          const nextData = JSON.parse(nextDataScript);
          const jobListings =
            nextData?.props?.pageProps?.jobListings ||
            nextData?.props?.pageProps?.jobs ||
            [];
          for (const job of jobListings.slice(0, 15)) {
            const title = job.title || job.name || '';
            const company = job.company?.name || job.startup?.name || '';
            if (title) {
              const jobLocation = job.remote
                ? 'Remote'
                : job.location || 'Not specified';
              jobs.push({
                externalId: `wellfound-${Buffer.from(title + company)
                  .toString('base64')
                  .slice(0, 20)}`,
                title,
                company: company || 'Unknown',
                location: jobLocation,
                salary: job.compensation || 'Not disclosed',
                url: job.url
                  ? job.url
                  : job.slug
                    ? `https://wellfound.com/jobs/${job.slug}`
                    : 'https://wellfound.com/jobs',
                source: 'Wellfound',
                tags: job.tags || job.skills || [],
                description: (job.description || '').slice(0, 500),
                postedAt: formatRelativeDate(job.postedAt || job.createdAt),
              });
            }
          }
        } catch {}
      }
    }

    console.log(`[Wellfound] Scraped ${jobs.length} jobs`);
    return jobs;
  } catch (error: any) {
    console.error('[Wellfound] Scrape error:', error?.message || error);
    return [];
  }
}


async function fetchFromRemotive(
  query: string,
  location: string = '',
): Promise<IJobListing[]> {
  try {
    const url = new URL('https://remotive.com/api/remote-jobs');
    const combinedQuery = location ? `${query} ${location}` : query;
    url.searchParams.set('search', combinedQuery);
    url.searchParams.set('limit', '15');

    const response = await axios.get(url.toString(), {
      timeout: HTTP_TIMEOUT_MS,
    });
    const data = response.data;
    const jobs: any[] = data?.jobs || [];

    return jobs.map((job) => ({
      externalId: `remotive-${job.id}`,
      title: job.title || 'Untitled',
      company: job.company_name || 'Unknown',
      location: job.candidate_required_location || 'Remote',
      salary: job.salary || 'Not disclosed',
      url: job.url || '#',
      source: 'Remotive',
      tags: (job.tags || []).slice(0, 8),
      description: stripHtml(job.description || '').slice(0, 500),
      postedAt: formatRelativeDate(job.publication_date),
    }));
  } catch (error: any) {
    console.error('[Remotive] Fetch error:', error?.message || error);
    return [];
  }
}


export async function fetchAllJobs(
  query: string,
  location: string = '',
): Promise<IJobListing[]> {
  console.log(
    `[JobFetcher] Fetching jobs for query: "${query}" in "${location}" from all sources...`,
  );

  const results = await Promise.allSettled([
    fetchFromJSearch(query, location),
    fetchIndiaJobs(query, location),
    scrapeLinkedIn(query, location),
    scrapeWellfound(query, location),
    fetchFromRemotive(query, location),
  ]);

  const sourceNames = [
    'JSearch (Indeed/Naukri/Glassdoor)',
    'JSearch India',
    'LinkedIn',
    'Wellfound',
    'Remotive',
    'Arbeitnow',
  ];

  const allJobs: IJobListing[] = [];
  let successCount = 0;

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const count = result.value.length;
      if (count > 0) successCount++;
      console.log(`[JobFetcher] ✓ ${sourceNames[index]}: ${count} jobs`);
      allJobs.push(...result.value);
    } else {
      console.warn(
        `[JobFetcher] ✗ ${sourceNames[index]} failed:`,
        result.reason?.message || result.reason,
      );
    }
  });

  const seen = new Set<string>();
  const dedupedJobs = allJobs.filter((job) => {
    const normalizedTitle = job.title.toLowerCase().trim().replace(/\s+/g, ' ');
    const normalizedCompany = job.company
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
    const key = `${normalizedTitle}::${normalizedCompany}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(
    `[JobFetcher] Total: ${allJobs.length} raw → ${dedupedJobs.length} after dedup (${successCount}/${sourceNames.length} sources succeeded)`,
  );
  return dedupedJobs;
}


function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatRelativeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Recently';

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Return as-is if not parseable

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 0) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  } catch {
    return 'Recently';
  }
}
