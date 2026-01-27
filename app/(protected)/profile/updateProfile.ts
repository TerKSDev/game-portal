'use server'

import { auth } from '@/lib/actions/auth'
import prisma from '@/lib/prisma'
import { writeFile } from 'fs/promises';
import { join } from 'path';

export default async function UpdateProfile(formData: FormData) {
    const session = await auth();

    if (!session) {
        throw new Error('Unauthorized');
    }

    const newName = formData.get('name') as string;
    const newEmail = formData.get('email') as string;
    const newImage = formData.get('image') as File | null;

    let imagePath = null;

    if (newImage && newImage.size > 0) {
        const bytes = await newImage.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const relativePath = `/uploads/${newImage.name}`;
        const absolutePath = join(process.cwd(), 'public', relativePath);

        await writeFile(absolutePath, buffer);
        
        imagePath = relativePath;
    }

    const updateData: any = {
        name: newName,
        email: newEmail,
    };

    if (imagePath) {
        updateData.image = imagePath;
    }

    await prisma.user.update({
        where: {
            id: session?.user?.id,
        },
        data: updateData,
    });

    return { success: true }
}