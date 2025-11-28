import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary} from 'cloudinary';
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getUserFromToken() {
     const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & { id: string} ;
  } catch {
    return null;
  }
}

export async function POST(req:NextRequest){
   try{

    await connectDB();

     // 1️⃣ Decode user from token
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    let event;

    try{

        event = Object.fromEntries(formData.entries());
    }catch(e){
        return NextResponse.json({message:'Invalid JSON data format'}, {status:400})
    }

    const file = formData.get('image') as File;

    if(!file) return NextResponse.json({message:'Image file is required'}, {status:400});

    const tags = JSON.parse(formData.get('tags') as string)
    const agenda = JSON.parse(formData.get('agenda') as string)


    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve,reject)=>{
           cloudinary.uploader.upload_stream({resource_type:'image', folder:'DevEvent'}, (error,results)=>{
            if(error) return reject(error);

            resolve(results)
           }).end(buffer);
    });

    event.image = (uploadResult as {secure_url:string}).secure_url;

    const createdEvent = await Event.create({
        ...event,
        tags:tags,
        agenda:agenda,
        creator:user.id, 
    });
    return NextResponse.json({message:'Event created successfully', event:createdEvent}, {status:201})

   }catch(e){
    console.error(e);
    return NextResponse.json({message:'Event Creation Failed', error: e instanceof Error ? e.message:'Unknown' }, {status:500})
   }
}

export async function GET(){
    try{
        await connectDB();
        const events = await Event.find().sort({createdAt:-1});
        return NextResponse.json({message:'Events fetched successfully', events},{status:200})

    }catch(e){
        return NextResponse.json({message:'Event fetching failed', error:e},{status:500})
    }
}


