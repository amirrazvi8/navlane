"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
}

interface CurrentStanding {
  overallScore: number;
  level: string;
  categories: CategoryScore[];
}


const BAR_COLORS = ["#00f5d4", "#00ff95", "#7b61ff", "#ff6b9d", "#ffd166", "#06d6a0"];

const LEVEL_CONFIG: Record<string, { color: string; glow: string; emoji: string }> = {
  Beginner:     { color: "#ff6b9d", glow: "0 0 20px rgba(255,107,157,0.4)", emoji: "🌱" },
  Intermediate: { color: "#ffd166", glow: "0 0 20px rgba(255,209,102,0.4)", emoji: "⚡" },
  Advanced:     { color: "#00f5d4", glow: "0 0 20px rgba(0,245,212,0.4)",   emoji: "🚀" },
  Expert:       { color: "#00ff95", glow: "0 0 20px rgba(0,255,149,0.4)",   emoji: "👑" },
};

function ScoreGauge({ score, level }: { score: number; level: string }) {
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.Intermediate;
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {/* Background track */}
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="rgba(46, 58, 71, 0.5)"
            strokeWidth="8"
          />
          {/* Animated score arc */}
          <motion.circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={config.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            style={{
              filter: `drop-shadow(${config.glow})`,
            }}
          />
        </svg>
        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold"
            style={{ color: config.color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
            out of 100
          </span>
        </div>
      </div>
      {/* Level badge */}
      <motion.div
        className="mt-3 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5"
        style={{
          background: `${config.color}15`,
          border: `1px solid ${config.color}40`,
          color: config.color,
          boxShadow: config.glow,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <span>{config.emoji}</span>
        <span>{level}</span>
      </motion.div>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="rounded-lg px-3 py-2 text-xs shadow-xl"
        style={{
          background: "rgba(20, 38, 56, 0.95)",
          border: "1px solid rgba(0, 245, 212, 0.2)",
          backdropFilter: "blur(8px)",
        }}
      >
        <p className="font-semibold text-white mb-0.5">{data.name}</p>
        <p style={{ color: "#00f5d4" }}>
          Score: <span className="font-bold">{data.score}</span>/100
        </p>
      </div>
    );
  }
  return null;
}

export function ResumeStandingChart({ currentStanding }: { currentStanding?: CurrentStanding | null }) {
  if (!currentStanding) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            Resume Standing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: "rgba(0, 245, 212, 0.08)", border: "1px solid rgba(0, 245, 212, 0.15)" }}
            >
              <TrendingUp className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Upload your resume to see your current standing analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const radarData = currentStanding.categories.map((cat) => ({
    name: cat.name,
    score: cat.score,
    fullMark: cat.maxScore,
  }));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          Resume Standing
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Overall Score + Level */}
          <div className="flex justify-center mb-4">
            <ScoreGauge score={currentStanding.overallScore} level={currentStanding.level} />
          </div>

          {/* Radar Chart */}
          <div className="w-full h-[250px] mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid
                  stroke="rgba(46, 58, 71, 0.6)"
                  strokeDasharray="3 3"
                />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8", fontSize: 9 }}
                  axisLine={false}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#00f5d4"
                  fill="#00f5d4"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: "#00f5d4",
                    stroke: "#0a1a2f",
                    strokeWidth: 2,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Bar Chart */}
          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={currentStanding.categories}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                barCategoryGap="20%"
              >
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(46, 58, 71, 0.4)" }}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={90}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 245, 212, 0.04)" }} />
                <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={14}>
                  {currentStanding.categories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>

          {/* Score Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {currentStanding.categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{
                  background: `${BAR_COLORS[index % BAR_COLORS.length]}08`,
                  border: `1px solid ${BAR_COLORS[index % BAR_COLORS.length]}20`,
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index + 1 }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: BAR_COLORS[index % BAR_COLORS.length] }}
                />
                <span className="text-[11px] text-muted-foreground truncate flex-1">{cat.name}</span>
                <span className="text-[11px] font-bold" style={{ color: BAR_COLORS[index % BAR_COLORS.length] }}>
                  {cat.score}%
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
