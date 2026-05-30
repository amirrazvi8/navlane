import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';

const PRIMARY_COLOR = '#0f766e';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
  },
  sidebar: {
    width: '35%',
    backgroundColor: '#f1f5f9',
    padding: 30,
  },
  main: {
    width: '65%',
    padding: 30,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  role: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  sectionTitleMain: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    borderBottomWidth: 2,
    borderBottomColor: PRIMARY_COLOR,
    paddingBottom: 5,
    marginBottom: 15,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  sectionTitleSide: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 10,
    marginTop: 20,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 5,
  },
  sectionTitleSideFirst: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 10,
    marginTop: 0,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 5,
  },
  textMain: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  textSide: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
    marginBottom: 5,
  },
  itemGroup: {
    marginBottom: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 3,
  },
  itemTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#0f172a',
  },
  itemSubtitle: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 10,
    color: PRIMARY_COLOR,
  },
  itemDate: {
    fontSize: 9,
    color: '#64748b',
    fontFamily: 'Helvetica-Bold',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 8,
  },
  bulletIcon: {
    width: 10,
    fontSize: 10,
    color: PRIMARY_COLOR,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.4,
    textAlign: 'justify',
  },
  skillCatName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#0f172a',
    marginBottom: 2,
  },
  skillCatGroup: {
    marginBottom: 8,
  },
  link: {
    color: PRIMARY_COLOR,
    textDecoration: 'none',
  }
});

export const ModernTemplate = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <Text style={styles.sectionTitleSideFirst}>Contact</Text>
        {data.personalInfo.email ? <Text style={styles.textSide}>Email: {data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={styles.textSide}>Phone: {data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={styles.textSide}>Location: {data.personalInfo.location}</Text> : null}
        {data.personalInfo.linkedin ? <Text style={styles.textSide}>LinkedIn: <Link src={data.personalInfo.linkedin} style={styles.link}>View Profile</Link></Text> : null}
        {data.personalInfo.portfolio ? <Text style={styles.textSide}>Portfolio: <Link src={data.personalInfo.portfolio} style={styles.link}>View Site</Link></Text> : null}
        {(data.personalInfo.customFields || []).map((field, i) => (
          field.label && field.value ? <Text key={i} style={styles.textSide}>{field.label}: {field.value}</Text> : null
        ))}

        {data.skills.length > 0 ? (
          <>
            <Text style={styles.sectionTitleSide}>Skills</Text>
            {data.skills.map((skillCat) => (
              <View key={skillCat.id} style={styles.skillCatGroup}>
                <Text style={styles.skillCatName}>{skillCat.category}</Text>
                <Text style={styles.textSide}>{skillCat.skills}</Text>
              </View>
            ))}
          </>
        ) : null}

        {data.certifications.length > 0 ? (
          <>
            <Text style={styles.sectionTitleSide}>Certifications</Text>
            {data.certifications.map((cert) => (
              <View key={cert.id} style={{ marginBottom: 10 }}>
                <Text style={styles.skillCatName}>{cert.name}</Text>
                <Text style={styles.textSide}>{cert.issuer} • {cert.date}</Text>
              </View>
            ))}
          </>
        ) : null}
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.name}>{data.personalInfo.fullName || "Your Name"}</Text>
          <Text style={styles.role}>{data.experience.length > 0 ? data.experience[0].role : "Professional"}</Text>
        </View>

        {data.summary ? (
          <View>
            <Text style={styles.sectionTitleMain}>Summary</Text>
            <Text style={styles.textMain}>{data.summary}</Text>
          </View>
        ) : null}

        {data.experience.length > 0 ? (
          <View>
            <Text style={styles.sectionTitleMain}>Experience</Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={styles.itemGroup}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.role}</Text>
                  <Text style={styles.itemDate}>{exp.startDate} – {exp.endDate}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                {exp.description ? (
                  <View style={{ marginTop: 6 }}>
                    {exp.description.split('\n').filter(Boolean).map((bullet, i) => (
                      <View key={i} style={styles.bulletPoint}>
                        <Text style={styles.bulletIcon}>•</Text>
                        <Text style={styles.bulletText}>{bullet.trim()}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {data.education.length > 0 ? (
          <View>
            <Text style={styles.sectionTitleMain}>Education</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.itemGroup}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.institution}</Text>
                  <Text style={styles.itemDate}>{edu.graduationYear}</Text>
                </View>
                <Text style={styles.textMain}>{edu.degree} in {edu.fieldOfStudy}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {data.projects.length > 0 ? (
          <View>
            <Text style={styles.sectionTitleMain}>Projects</Text>
            {data.projects.map((proj) => (
              <View key={proj.id} style={styles.itemGroup}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{proj.name}</Text>
                  {proj.link ? <Link src={proj.link} style={{ ...styles.textMain, color: PRIMARY_COLOR }}>View Project</Link> : null}
                </View>
                <Text style={styles.itemSubtitle}>{proj.technologies}</Text>
                <Text style={{ ...styles.textMain, marginTop: 4 }}>{proj.description}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Custom Sections */}
        {(data.customSections || []).map((section) => (
          <View key={section.id}>
            <Text style={styles.sectionTitleMain}>{section.title}</Text>
            <View style={styles.itemGroup}>
              {section.content.split('\n').filter(Boolean).map((bullet, i) => (
                <View key={i} style={styles.bulletPoint}>
                  <Text style={styles.bulletIcon}>•</Text>
                  <Text style={styles.bulletText}>{bullet.trim()}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

      </View>
    </Page>
  </Document>
);
