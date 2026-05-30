// ---------------------------------------------------------------------------
// Job Fetcher Service — Multi-Platform Scraping + API
// ---------------------------------------------------------------------------
// Fetches real-time job listings from 8 sources:
//
// DIRECT SCRAPERS (Best Effort):
//   1. LinkedIn    — Public guest jobs endpoint (HTML fragments)
//   2. Indeed      — Server-rendered job search pages
//   3. Glassdoor   — Public job listing pages
//   4. Naukri      — Job search pages (India-focused)
//   5. Wellfound   — Startup job listings
//
// RELIABLE APIs (Always Available):
//   6. JSearch     — Google for Jobs aggregator (covers all platforms)
//   7. Remotive    — Remote jobs (free, no auth)
//   8. Arbeitnow   — European + remote jobs (free, no auth)
//
// All sources are fetched in parallel via Promise.allSettled.
// If scrapers fail (rate limits, blocks), the APIs ensure results.
// ---------------------------------------------------------------------------

import * as cheerio from "cheerio";

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
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

// ═══════════════════════════════════════════════════════════════════════════
// 1. LINKEDIN — Public Guest Jobs Endpoint
// ═══════════════════════════════════════════════════════════════════════════
// LinkedIn serves job listings to non-logged-in visitors via a guest endpoint
// that returns HTML fragments. This is the most reliable scraping target.

async function scrapeLinkedIn(query: string): Promise<IJobListing[]> {
  try {
    const url = new URL(
      "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search"
    );
    url.searchParams.set("keywords", query);
    url.searchParams.set("location", "");
    url.searchParams.set("start", "0");
    url.searchParams.set("f_TPR", "r604800"); // Past week

    const response = await fetch(url.toString(), {
      headers: {
        ...BROWSER_HEADERS,
        Referer: "https://www.linkedin.com/jobs/search",
      },
    });

    if (!response.ok) {
      console.warn(`[LinkedIn] HTTP ${response.status}`);
      return [];
    }

    const html = await response.text();
    if (!html || html.length < 100) return [];

    const $ = cheerio.load(html);
    const jobs: IJobListing[] = [];

    $("li").each((i, el) => {
      if (i >= 15) return false; // Limit results

      const title =
        $(el).find(".base-search-card__title").text().trim() ||
        $(el).find("h3").text().trim();
      const company =
        $(el).find(".base-search-card__subtitle").text().trim() ||
        $(el).find("h4").text().trim();
      const location = $(el)
        .find(".job-search-card__location")
        .text()
        .trim();
      const link =
        $(el).find("a.base-card__full-link").attr("href") ||
        $(el).find("a").first().attr("href") ||
        "#";
      const postedAt = $(el)
        .find(".job-search-card__listdate, time")
        .attr("datetime") ||
        $(el).find(".job-search-card__listdate, time").text().trim();

      if (title && company) {
        jobs.push({
          externalId: `linkedin-${Buffer.from(title + company).toString("base64").slice(0, 20)}`,
          title,
          company,
          location: location || "Not specified",
          salary: "Not disclosed",
          url: link.startsWith("http") ? link : `https://www.linkedin.com${link}`,
          source: "LinkedIn",
          tags: [],
          description: "",
          postedAt: formatRelativeDate(postedAt),
        });
      }
    });

    console.log(`[LinkedIn] Scraped ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error("[LinkedIn] Scrape error:", error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. INDEED — Server-Rendered Job Search Pages
// ═══════════════════════════════════════════════════════════════════════════
// Indeed renders job cards in server-side HTML. We parse the search results
// page to extract job listings.

async function scrapeIndeed(query: string): Promise<IJobListing[]> {
  try {
    const url = new URL("https://www.indeed.com/jobs");
    url.searchParams.set("q", query);
    url.searchParams.set("fromage", "7"); // Past 7 days
    url.searchParams.set("limit", "15");

    const response = await fetch(url.toString(), {
      headers: {
        ...BROWSER_HEADERS,
        Referer: "https://www.indeed.com/",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      console.warn(`[Indeed] HTTP ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const jobs: IJobListing[] = [];

    // Indeed embeds job data in script tags as JSON
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html() || "{}");
        if (data["@type"] === "JobPosting") {
          jobs.push({
            externalId: `indeed-${Buffer.from(data.title + data.hiringOrganization?.name).toString("base64").slice(0, 20)}`,
            title: data.title || "Untitled",
            company: data.hiringOrganization?.name || "Unknown",
            location: data.jobLocation?.address?.addressLocality || "Not specified",
            salary: data.baseSalary
              ? `${data.baseSalary.currency || "$"} ${data.baseSalary.value?.minValue || ""} - ${data.baseSalary.value?.maxValue || ""}`
              : "Not disclosed",
            url: data.url || "#",
            source: "Indeed",
            tags: [],
            description: stripHtml(data.description || "").slice(0, 500),
            postedAt: formatRelativeDate(data.datePosted),
          });
        }
      } catch {}
    });

    // Fallback: parse HTML job cards if JSON-LD not found
    if (jobs.length === 0) {
      $(".job_seen_beacon, .jobsearch-ResultsList .result, .tapItem, [data-jk]").each(
        (i, el) => {
          if (i >= 15) return false;

          const title =
            $(el).find(".jobTitle span, h2.jobTitle a span").text().trim() ||
            $(el).find("h2 a").text().trim();
          const company =
            $(el).find("[data-testid='company-name'], .companyName, .company").text().trim();
          const location =
            $(el).find("[data-testid='text-location'], .companyLocation, .location").text().trim();
          const link = $(el).find("h2 a, a.jcs-JobTitle").attr("href") || "";

          if (title) {
            jobs.push({
              externalId: `indeed-${Buffer.from(title + company).toString("base64").slice(0, 20)}`,
              title,
              company: company || "Unknown",
              location: location || "Not specified",
              salary: "Not disclosed",
              url: link.startsWith("http") ? link : `https://www.indeed.com${link}`,
              source: "Indeed",
              tags: [],
              description: "",
              postedAt: "Recently",
            });
          }
        }
      );
    }

    console.log(`[Indeed] Scraped ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error("[Indeed] Scrape error:", error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. GLASSDOOR — Public Job Listing Pages
// ═══════════════════════════════════════════════════════════════════════════
// Glassdoor has some server-rendered content on its job pages.
// We attempt to parse both JSON-LD structured data and HTML cards.

async function scrapeGlassdoor(query: string): Promise<IJobListing[]> {
  try {
    const searchQuery = query.replace(/\s+/g, "-").toLowerCase();
    const url = `https://www.glassdoor.com/Job/${searchQuery}-jobs-SRCH_KO0,${searchQuery.length}.htm`;

    const response = await fetch(url, {
      headers: {
        ...BROWSER_HEADERS,
        Referer: "https://www.glassdoor.com/",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      console.warn(`[Glassdoor] HTTP ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const jobs: IJobListing[] = [];

    // Try JSON-LD structured data first
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html() || "{}");
        const items = data["@graph"] || (Array.isArray(data) ? data : [data]);
        for (const item of items) {
          if (item["@type"] === "JobPosting" && jobs.length < 15) {
            jobs.push({
              externalId: `glassdoor-${Buffer.from(item.title + (item.hiringOrganization?.name || "")).toString("base64").slice(0, 20)}`,
              title: item.title || "Untitled",
              company: item.hiringOrganization?.name || "Unknown",
              location: item.jobLocation?.address?.addressLocality || "Not specified",
              salary: "Not disclosed",
              url: item.url || "#",
              source: "Glassdoor",
              tags: [],
              description: stripHtml(item.description || "").slice(0, 500),
              postedAt: formatRelativeDate(item.datePosted),
            });
          }
        }
      } catch {}
    });

    // Fallback: try HTML job cards
    if (jobs.length === 0) {
      $('[data-test="jobListing"], .react-job-listing, li.JobsList_jobListItem__JBBUV').each(
        (i, el) => {
          if (i >= 15) return false;

          const title = $(el)
            .find('[data-test="job-title"], .job-title, a.jobLink')
            .text()
            .trim();
          const company = $(el)
            .find('[data-test="emp-name"], .EmployerProfile_compactEmployerName__LE242')
            .text()
            .trim();
          const location = $(el)
            .find('[data-test="emp-location"], .location')
            .text()
            .trim();
          const link = $(el).find("a").first().attr("href") || "";

          if (title) {
            jobs.push({
              externalId: `glassdoor-${Buffer.from(title + company).toString("base64").slice(0, 20)}`,
              title,
              company: company || "Unknown",
              location: location || "Not specified",
              salary: "Not disclosed",
              url: link.startsWith("http") ? link : `https://www.glassdoor.com${link}`,
              source: "Glassdoor",
              tags: [],
              description: "",
              postedAt: "Recently",
            });
          }
        }
      );
    }

    console.log(`[Glassdoor] Scraped ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error("[Glassdoor] Scrape error:", error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. NAUKRI — Job Search Pages (India-focused)
// ═══════════════════════════════════════════════════════════════════════════
// Naukri returns some server-rendered content that we can parse.
// Class names change frequently so we use multiple selector strategies.

async function scrapeNaukri(query: string): Promise<IJobListing[]> {
  try {
    const searchSlug = query.replace(/\s+/g, "-").toLowerCase();
    const url = `https://www.naukri.com/${searchSlug}-jobs`;

    const response = await fetch(url, {
      headers: {
        ...BROWSER_HEADERS,
        Referer: "https://www.naukri.com/",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      console.warn(`[Naukri] HTTP ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const jobs: IJobListing[] = [];

    // Try JSON-LD structured data (Naukri sometimes includes this)
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html() || "{}");
        const items = data.itemListElement || data["@graph"] || (Array.isArray(data) ? data : []);
        for (const wrapper of items) {
          const item = wrapper.item || wrapper;
          if (item["@type"] === "JobPosting" && jobs.length < 15) {
            jobs.push({
              externalId: `naukri-${Buffer.from(item.title + (item.hiringOrganization?.name || "")).toString("base64").slice(0, 20)}`,
              title: item.title || "Untitled",
              company: item.hiringOrganization?.name || "Unknown",
              location:
                item.jobLocation?.address?.addressLocality ||
                (typeof item.jobLocation === "string" ? item.jobLocation : "India"),
              salary: item.baseSalary
                ? `₹${item.baseSalary.value?.minValue || ""} - ₹${item.baseSalary.value?.maxValue || ""}`
                : "Not disclosed",
              url: item.url || `https://www.naukri.com/${searchSlug}-jobs`,
              source: "Naukri",
              tags: item.skills ? item.skills.split(",").map((s: string) => s.trim()) : [],
              description: stripHtml(item.description || "").slice(0, 500),
              postedAt: formatRelativeDate(item.datePosted),
            });
          }
        }
      } catch {}
    });

    // Fallback: HTML parsing with multiple selector strategies
    if (jobs.length === 0) {
      $(
        '.srp-jobtuple-wrapper, .jobTuple, [class*="jobTuple"], article.jobTupleHeader'
      ).each((i, el) => {
        if (i >= 15) return false;

        const title =
          $(el).find(".title, a.title, [class*=\"title\"]").first().text().trim() ||
          $(el).find("a").first().text().trim();
        const company = $(el)
          .find(".comp-name, .subTitle, [class*=\"companyInfo\"]")
          .first()
          .text()
          .trim();
        const location = $(el)
          .find(".locWdth, .loc, [class*=\"location\"]")
          .first()
          .text()
          .trim();
        const salary = $(el)
          .find('.sal, .salary, [class*="salary"]')
          .first()
          .text()
          .trim();
        const link = $(el).find("a.title, a").first().attr("href") || "";

        if (title) {
          jobs.push({
            externalId: `naukri-${Buffer.from(title + company).toString("base64").slice(0, 20)}`,
            title,
            company: company || "Unknown",
            location: location || "India",
            salary: salary || "Not disclosed",
            url: link.startsWith("http") ? link : `https://www.naukri.com${link}`,
            source: "Naukri",
            tags: [],
            description: "",
            postedAt: "Recently",
          });
        }
      });
    }

    console.log(`[Naukri] Scraped ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error("[Naukri] Scrape error:", error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. WELLFOUND — Startup Job Listings
// ═══════════════════════════════════════════════════════════════════════════
// Wellfound (formerly AngelList Talent) has some server-rendered content.
// We attempt to parse their job listing pages.

async function scrapeWellfound(query: string): Promise<IJobListing[]> {
  try {
    const url = new URL("https://wellfound.com/jobs");
    url.searchParams.set("query", query);

    const response = await fetch(url.toString(), {
      headers: {
        ...BROWSER_HEADERS,
        Referer: "https://wellfound.com/",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      console.warn(`[Wellfound] HTTP ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const jobs: IJobListing[] = [];

    // Try JSON-LD structured data
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html() || "{}");
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item["@type"] === "JobPosting" && jobs.length < 15) {
            jobs.push({
              externalId: `wellfound-${Buffer.from(item.title + (item.hiringOrganization?.name || "")).toString("base64").slice(0, 20)}`,
              title: item.title || "Untitled",
              company: item.hiringOrganization?.name || "Unknown",
              location:
                item.jobLocation?.address?.addressLocality || "Remote",
              salary: "Not disclosed",
              url: item.url || "https://wellfound.com/jobs",
              source: "Wellfound",
              tags: [],
              description: stripHtml(item.description || "").slice(0, 500),
              postedAt: formatRelativeDate(item.datePosted),
            });
          }
        }
      } catch {}
    });

    // Fallback: Try to extract from __NEXT_DATA__ (Wellfound uses Next.js)
    if (jobs.length === 0) {
      const nextDataScript = $("#__NEXT_DATA__").html();
      if (nextDataScript) {
        try {
          const nextData = JSON.parse(nextDataScript);
          const jobListings =
            nextData?.props?.pageProps?.jobListings ||
            nextData?.props?.pageProps?.jobs ||
            [];
          for (const job of jobListings.slice(0, 15)) {
            const title = job.title || job.name || "";
            const company = job.company?.name || job.startup?.name || "";
            if (title) {
              jobs.push({
                externalId: `wellfound-${Buffer.from(title + company).toString("base64").slice(0, 20)}`,
                title,
                company: company || "Unknown",
                location:
                  job.location || job.remote ? "Remote" : "Not specified",
                salary: job.compensation || "Not disclosed",
                url:
                  job.url || job.slug
                    ? `https://wellfound.com/jobs/${job.slug}`
                    : "https://wellfound.com/jobs",
                source: "Wellfound",
                tags: job.tags || job.skills || [],
                description: (job.description || "").slice(0, 500),
                postedAt: formatRelativeDate(job.postedAt || job.createdAt),
              });
            }
          }
        } catch {}
      }
    }

    console.log(`[Wellfound] Scraped ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error("[Wellfound] Scrape error:", error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. JSEARCH — Google for Jobs Aggregator (RapidAPI)
// ═══════════════════════════════════════════════════════════════════════════
// Covers: LinkedIn, Indeed, Glassdoor, Naukri, ZipRecruiter, and more.
// Requires RAPIDAPI_KEY in .env (free tier: 200 req/month).

async function fetchFromJSearch(query: string): Promise<IJobListing[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    console.warn("[JSearch] RAPIDAPI_KEY not set — skipping");
    return [];
  }

  try {
    const url = new URL("https://jsearch.p.rapidapi.com/search");
    url.searchParams.set("query", query);
    url.searchParams.set("page", "1");
    url.searchParams.set("num_pages", "1");
    url.searchParams.set("date_posted", "week");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      console.error(`[JSearch] HTTP ${response.status}: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    const jobs: any[] = data?.data || [];

    return jobs.map((job) => ({
      externalId: `jsearch-${job.job_id || Math.random().toString(36).slice(2)}`,
      title: job.job_title || "Untitled",
      company: job.employer_name || "Unknown",
      location: formatJSearchLocation(job),
      salary: formatJSearchSalary(job),
      url: job.job_apply_link || job.job_google_link || "#",
      source: job.job_publisher || "Google Jobs",
      tags: extractJSearchTags(job),
      description: (job.job_description || "").slice(0, 500),
      postedAt: formatRelativeDate(job.job_posted_at_datetime_utc),
    }));
  } catch (error) {
    console.error("[JSearch] Fetch error:", error);
    return [];
  }
}

function formatJSearchLocation(job: any): string {
  const parts = [job.job_city, job.job_state, job.job_country].filter(Boolean);
  const location = parts.join(", ") || "Not specified";
  if (job.job_is_remote) return `${location} (Remote)`;
  return location;
}

function formatJSearchSalary(job: any): string {
  const min = job.job_min_salary;
  const max = job.job_max_salary;
  const currency = job.job_salary_currency || "USD";
  const period = job.job_salary_period || "YEAR";

  if (min && max) {
    return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}/${period.toLowerCase()}`;
  }
  if (min) return `From ${formatCurrency(min, currency)}/${period.toLowerCase()}`;
  if (max) return `Up to ${formatCurrency(max, currency)}/${period.toLowerCase()}`;
  return "Not disclosed";
}

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
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
        : [])
    );
  }
  const highlights = job.job_highlights;
  if (highlights?.Qualifications) {
    const qualText = highlights.Qualifications.join(" ");
    const techKeywords = [
      "React", "Next.js", "Node.js", "TypeScript", "JavaScript", "Python",
      "Django", "Flask", "Java", "Spring", "AWS", "Azure", "GCP", "Docker",
      "Kubernetes", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "REST",
      "Git", "CI/CD", "TensorFlow", "PyTorch", "ML", "AI",
      "Machine Learning", "Go", "Rust", "C++", "C#", ".NET", "PHP",
      "Angular", "Vue.js", "Svelte", "Tailwind", "CSS", "HTML", "SQL",
      "Figma", "Terraform", "Linux", "Microservices",
    ];
    for (const kw of techKeywords) {
      if (qualText.toLowerCase().includes(kw.toLowerCase()) && !tags.includes(kw)) {
        tags.push(kw);
      }
    }
  }
  return tags.slice(0, 8);
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. REMOTIVE — Free API, Remote Jobs
// ═══════════════════════════════════════════════════════════════════════════

async function fetchFromRemotive(query: string): Promise<IJobListing[]> {
  try {
    const url = new URL("https://remotive.com/api/remote-jobs");
    url.searchParams.set("search", query);
    url.searchParams.set("limit", "15");

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error(`[Remotive] HTTP ${response.status}`);
      return [];
    }

    const data = await response.json();
    const jobs: any[] = data?.jobs || [];

    return jobs.map((job) => ({
      externalId: `remotive-${job.id}`,
      title: job.title || "Untitled",
      company: job.company_name || "Unknown",
      location: job.candidate_required_location || "Remote",
      salary: job.salary || "Not disclosed",
      url: job.url || "#",
      source: "Remotive",
      tags: (job.tags || []).slice(0, 8),
      description: stripHtml(job.description || "").slice(0, 500),
      postedAt: formatRelativeDate(job.publication_date),
    }));
  } catch (error) {
    console.error("[Remotive] Fetch error:", error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. ARBEITNOW — Free API, European + Remote Jobs
// ═══════════════════════════════════════════════════════════════════════════

async function fetchFromArbeitnow(query: string): Promise<IJobListing[]> {
  try {
    const url = new URL("https://www.arbeitnow.com/api/job-board-api");

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error(`[Arbeitnow] HTTP ${response.status}`);
      return [];
    }

    const data = await response.json();
    let jobs: any[] = data?.data || [];

    // Filter by query since Arbeitnow doesn't have a search param
    const queryLower = query.toLowerCase();
    jobs = jobs.filter(
      (job) =>
        (job.title || "").toLowerCase().includes(queryLower) ||
        (job.description || "").toLowerCase().includes(queryLower) ||
        (job.tags || []).some((tag: string) =>
          tag.toLowerCase().includes(queryLower)
        )
    );

    return jobs.slice(0, 15).map((job) => ({
      externalId: `arbeitnow-${job.slug || Math.random().toString(36).slice(2)}`,
      title: job.title || "Untitled",
      company: job.company_name || "Unknown",
      location: job.location || "Not specified",
      salary: "Not disclosed",
      url: job.url || `https://www.arbeitnow.com/view/${job.slug}`,
      source: "Arbeitnow",
      tags: (job.tags || []).slice(0, 8),
      description: stripHtml(job.description || "").slice(0, 500),
      postedAt: formatRelativeDate(
        job.created_at ? new Date(job.created_at * 1000).toISOString() : null
      ),
    }));
  } catch (error) {
    console.error("[Arbeitnow] Fetch error:", error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED FETCH — All 8 Sources in Parallel
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchAllJobs(query: string): Promise<IJobListing[]> {
  console.log(`[JobFetcher] Fetching jobs for query: "${query}" from 8 sources...`);

  const results = await Promise.allSettled([
    // Direct scrapers (best effort — may fail due to anti-bot)
    scrapeLinkedIn(query),
    scrapeIndeed(query),
    scrapeGlassdoor(query),
    scrapeNaukri(query),
    scrapeWellfound(query),
    // Reliable APIs (always available)
    fetchFromJSearch(query),
    fetchFromRemotive(query),
    fetchFromArbeitnow(query),
  ]);

  const sourceNames = [
    "LinkedIn", "Indeed", "Glassdoor", "Naukri", "Wellfound",
    "JSearch", "Remotive", "Arbeitnow",
  ];

  const allJobs: IJobListing[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`[JobFetcher] ✓ ${sourceNames[index]}: ${result.value.length} jobs`);
      allJobs.push(...result.value);
    } else {
      console.warn(`[JobFetcher] ✗ ${sourceNames[index]} failed:`, result.reason);
    }
  });

  // Deduplicate by title + company (case-insensitive)
  const seen = new Set<string>();
  const dedupedJobs = allJobs.filter((job) => {
    const key = `${job.title.toLowerCase().trim()}::${job.company.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(
    `[JobFetcher] Total: ${allJobs.length} raw → ${dedupedJobs.length} after dedup`
  );
  return dedupedJobs;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function formatRelativeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Recently";

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Return as-is if not parseable

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 0) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  } catch {
    return "Recently";
  }
}
