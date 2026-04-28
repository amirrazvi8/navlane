import mongoose from 'mongoose'

export interface ISkill {
name:string,
level:"Beginner"|"Intermediate"|"Advanced"|"Expert"
}

export interface IUser {
 name:string,
 email:string,
 password:string,
 education:string,
 profileImage?:string,
 bio?:string,
 skills:ISkill[],
 careerGoal:{
  role:'Frontend Development'| "Backend Development"| " Ai Enginner" | "Cloud Enginner",
 }
 

 
}

 const SkillSchema= new mongoose.Schema<ISkill>({
   name:{
    type:String,
    required:true
   },
   level:{
   type:String,
   enum:["Beginner","Intermediate","Advanced","Expert"],
   required:true
   }

 })

const UserSchema =new mongoose.Schema<IUser>({
 name:{
  type:String,
  required:true
 },
 email:{
  type:String,
  required:true,
  unique:true
 },
 password:{
 type:String,
 required:true
 },
education:{
 type:String,
 default:''
 },
 profileImage:{
  type:String
 },
 bio:{
  type:String,
  default:""
 },
 careerGoal:{
  role:{
   type:String,
   enum:['Frontend Development',"Backend Development", " Ai Enginner" , "Cloud Enginner"]
  }
  
 },
 skills:{
  type:[SkillSchema],
  default:[]
  
 }

},{timestamps:true})

export default mongoose.models.User || mongoose.model<IUser>("User",UserSchema);