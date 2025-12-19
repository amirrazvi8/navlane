import mongoose, { Schema } from "mongoose";
interface IInsight {

    trendingSkills?:{
        skillName: string, 
        trendScore: number, 
        status: 'Hot' | 'Growing' | 'stable' | 'Declining'
    }[];
   
    marketDemandAnalysis?:{
        role: string, 
        demandScore: number,
        demandLevel: 'High Demand' | "Medium Demand" | "Low Demand"
    }[];
    competitionAnalysis?:{
        role: string,
        numberOfApplicants: number,
        numberofJobs: number,
        competitionLevel: 'Croweded' | 'Competitive' | 'Balanced' | 'Undercrowded' 
    }[];

}
const InsightSchema = new Schema<IInsight>({
    trendingSkills:[
      { 
        skillName:{ type: String, required: true },
        trendScore:{ type: Number, required: true },
        status:{ 
            type: String,
            enum: ['Hot', 'Growing', 'stable', 'Declining'],
            required: true 
        } 
     }
    ], 
   
    marketDemandAnalysis:[
      {
        role:{ type: String, required: true },
        demandScore:{ type: Number, required: true },
        demandLevel:{ 
            type: String,
            enum: ['High Demand', 'Medium Demand', 'Low Demand'],
            required: true 
        }
      }
    ],
    competitionAnalysis:[
      {
        role:{ type: String, required: true },
        numberOfApplicants:{ type: Number, required: true },
        numberofJobs:{ type: Number, required: true },
        competitionLevel:{ 
            type: String,
            enum: ['Croweded', 'Competitive', 'Balanced', 'Undercrowded'], required: true 
        }
      }
    ]
},{timestamps:true});
export const InsightModel = mongoose.model<IInsight>('Insight', InsightSchema);
