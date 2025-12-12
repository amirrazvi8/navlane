import mongoose,{Schema} from 'mongoose';
interface ISkill{
  
    name:string;
    level:"Beginner" | "Intermediate" | "Advanced" | "Expert";
    resume?:{
         fileUrl:string;
         uploadedAt:Date;
    };
    createdAt:Date;
    updatedAt:Date;
}
const skillSchema=new Schema<ISkill>({
    name:{type:String,required:true},
    level:{type:String,
    enum:["Beginner","Intermediate","Advanced","Expert"],
    default:'Beginner'
    },
    resume:{
        fileUrl:{type:String,required:true},
        uploadedAt:{type:Date,required:true,default:Date.now}
    }

},{timestamps:true});
const Skill=mongoose.model<ISkill>('Skill',skillSchema)
export default Skill;