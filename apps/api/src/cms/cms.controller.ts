import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('CMS')
@Controller('cms')
export class CMSController {
  constructor(private prisma: PrismaService) {}

  @Get('pages/:slug')
  @ApiOperation({ summary: 'Get CMS page with active sections' })
  async getPage(@Param('slug') slug: string) {
    return this.prisma.cMSPage.findUnique({
      where: { slug },
      include: {
        sections: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  @Put('sections/:id')
  @ApiOperation({ summary: 'Update CMS Section' })
  async updateSection(@Param('id') id: string, @Body() data: any) {
    return this.prisma.cMSSection.update({
      where: { id },
      data,
    });
  }
}
