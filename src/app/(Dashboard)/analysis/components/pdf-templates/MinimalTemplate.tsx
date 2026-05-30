import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    paddingVertical: 40,
    paddingHorizontal: 50,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
    backgroundColor: '#fff',
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 30,
  },
  name: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  contactInfo: {
    fontSize: 9,
    color: '#666',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  summary: {
    fontSize: 10,
    color: '#444',
    textAlign: 'justify',
  },
  itemGroup: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  itemTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#444',
  },
  itemDate: {
    fontSize: 9,
    color: '#888',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 10,
  },
  bulletIcon: {
    width: 10,
    fontSize: 10,
    color: '#888',
  },
  bulletText: {
    flex: 1,
    color: '#444',
    textAlign: 'justify',
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  skillCategory: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
  skillValues: {
    fontSize: 10,
    color: '#444',
  },
  link: {
    color: '#1a1a1a',
    textDecoration: 'underline',
  }
});

export const MinimalTemplate = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo.fullName || "YOUR NAME"}</Text>
        <View style={styles.contactInfo}>
          {data.personalInfo.email ? <Text>{data.personalInfo.email}</Text> : null}
          {data.personalInfo.phone ? <Text>{data.personalInfo.phone}</Text> : null}
          {data.personalInfo.location ? <Text>{data.personalInfo.location}</Text> : null}
          {data.personalInfo.linkedin ? <Link src={data.personalInfo.linkedin} style={styles.link}>LinkedIn</Link> : null}
          {data.personalInfo.portfolio ? <Link src={data.personalInfo.portfolio} style={styles.link}>Portfolio</Link> : null}
          {(data.personalInfo.customFields || []).map((field, i) => (
            field.label && field.value ? <Text key={i}>{field.label}: {field.value}</Text> : null
          ))}
        </View>
      </View>

      {/* Summary */}
      {data.summary ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summary}>{data.summary}</Text>
        </View>
      ) : null}

      {/* Experience */}
      {data.experience.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.experience.map((exp) => (
            <View key={exp.id} style={styles.itemGroup}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{exp.role}</Text>
                <Text style={styles.itemDate}>{exp.startDate} — {exp.endDate}</Text>
              </View>
              <Text style={styles.itemSubtitle}>{exp.company}</Text>
              {exp.description ? (
                <View style={{ marginTop: 6 }}>
                  {exp.description.split('\n').filter(Boolean).map((bullet, i) => (
                    <View key={i} style={styles.bulletPoint}>
                      <Text style={styles.bulletIcon}>-</Text>
                      <Text style={styles.bulletText}>{bullet.trim()}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* Education */}
      {data.education.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu) => (
            <View key={edu.id} style={styles.itemGroup}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{edu.institution}</Text>
                <Text style={styles.itemDate}>{edu.graduationYear}</Text>
              </View>
              <Text style={styles.itemSubtitle}>{edu.degree} in {edu.fieldOfStudy}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Skills */}
      {data.skills.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {data.skills.map((skillCat) => (
            <View key={skillCat.id} style={styles.skillRow}>
              <Text style={styles.skillCategory}>{skillCat.category}: </Text>
              <Text style={styles.skillValues}>{skillCat.skills}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Projects */}
      {data.projects.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {data.projects.map((proj) => (
            <View key={proj.id} style={styles.itemGroup}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{proj.name}</Text>
                <Text style={styles.itemSubtitle}>{proj.technologies}</Text>
              </View>
              {proj.link ? <Link src={proj.link} style={styles.link}>{proj.link}</Link> : null}
              <Text style={{ ...styles.summary, marginTop: 2 }}>{proj.description}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Certifications */}
      {data.certifications.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          {data.certifications.map((cert) => (
            <View key={cert.id} style={styles.itemGroup}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{cert.name}</Text>
                <Text style={styles.itemDate}>{cert.date}</Text>
              </View>
              <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Custom Sections */}
      {(data.customSections || []).map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={{ marginTop: 4 }}>
            {section.content.split('\n').filter(Boolean).map((bullet, i) => (
              <View key={i} style={styles.bulletPoint}>
                <Text style={styles.bulletIcon}>-</Text>
                <Text style={styles.bulletText}>{bullet.trim()}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

    </Page>
  </Document>
);
