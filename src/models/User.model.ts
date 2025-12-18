import mongoose,{Schema} from 'mongoose';
 interface IUser{
  name:string;
  username: string;
  email:string;
  password:string;
  googleId?:string;
  avatar?:string;
  about?:string;
  skills?:mongoose.Types.ObjectId[];
  goals?:mongoose.Types.ObjectId[];
  roadmaps?:mongoose.Types.ObjectId[];
  createdAt:Date;
  updatedAt:Date;
  }

 const userSchema= new Schema<IUser>({
  name:{type:String,required:true},
  username:{type:String,required:true,unique:true},
  email:{type:String,required:true,unique:true},
  password:{type:String},
  googleId:{type:String},
  avatar:{type:String},
  about:{type:String},
  skills:[{type:mongoose.Schema.Types.ObjectId,ref:'Skill'}],
  goals:[{type:mongoose.Schema.Types.ObjectId,ref:'Goal'}],
  roadmaps:[{type:mongoose.Schema.Types.ObjectId,ref:'Roadmap'}],
 },
 {timestamps:true}
 );
 const User=mongoose.model<IUser>('User',userSchema)
 export default User;