// pages/api/images.js

import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

// Đường dẫn đến file JSON
const dataFilePath = path.join(process.cwd(), 'data/images.json');

export async function POST(req, res) {
    if (req.method === 'POST') {
        // Lấy thông tin ảnh từ request body
        const { imageUrl, timestamp } = await req.json();
        console.log(req.json());
        // Đọc dữ liệu hiện tại từ file JSON
        let imageDataArray = [];
        try {
            const data = fs.readFileSync(dataFilePath, 'utf-8');
            imageDataArray = JSON.parse(data);
        } catch (error) {
            console.error('Error reading file:', error);
        }

        // Thêm thông tin ảnh mới vào mảng
        imageDataArray.push({ imageUrl, timestamp });

        // Ghi lại dữ liệu vào file JSON
        try {
            fs.writeFileSync(dataFilePath, JSON.stringify(imageDataArray, null, 2));

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error('Error writing file:', error);
            return NextResponse.json({ success: false, error: 'Failed to save image data' });
        }
    } else {
        return NextResponse.json({ error: 'Method not allowed' });
    }
}
