import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  @Post()
  @ApiOperation({ summary: 'Upload an image file directly from client' })
  async uploadFile(@Body() body: { filename: string; base64: string }) {
    if (!body.base64) {
      throw new Error('No base64 image data provided');
    }

    const cleanFilename = (body.filename || `product-${Date.now()}.jpg`)
      .replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Extract base64 payload
    const matches = body.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const buffer = matches
      ? Buffer.from(matches[2], 'base64')
      : Buffer.from(body.base64, 'base64');

    const projectRoot = path.resolve(__dirname, '../../../..');
    const webUploadDir = path.join(projectRoot, 'apps/web/public/uploads');
    const adminUploadDir = path.join(projectRoot, 'apps/admin/public/uploads');

    fs.mkdirSync(webUploadDir, { recursive: true });
    fs.mkdirSync(adminUploadDir, { recursive: true });

    const webPath = path.join(webUploadDir, cleanFilename);
    const adminPath = path.join(adminUploadDir, cleanFilename);

    fs.writeFileSync(webPath, buffer);
    fs.writeFileSync(adminPath, buffer);

    return {
      success: true,
      data: {
        url: `/uploads/${cleanFilename}`,
        filename: cleanFilename,
      },
    };
  }
}