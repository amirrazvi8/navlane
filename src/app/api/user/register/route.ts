import { NextResponse } from "next/server";
import dbConnected from "@/lib/db";
import User from "@/models/User";
import bcrypt from 'bcryptjs'




export async function POST(req: Request) {
    await dbConnected();
    try {
        const { name, email, password, education, bio } = await req.json();
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Name , Email and Password required" },
                { status: 400 }
            )
        }
        const existUser = await User.findOne({ email });
        if (existUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 })
        }
        const hashpassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashpassword,
            bio,
            education
        })
        return NextResponse.json(
            {
                message: "User register successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    bio: user.bio,
                    education: user.education
                }
            }, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { message: "Somethings went wrong" },
            { status: 500 }
        )
    }
}