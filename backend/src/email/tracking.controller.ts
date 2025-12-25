import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { EmailLogModel } from '../schemas/email-log.schema';

@Controller('email')
export class TrackingController {
  // transparent 1x1 png (base64)
  private tinyPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=',
    'base64'
  );

  @Get('open/:id.png')
  async open(@Param('id') id: string, @Res() res: Response) {
    try {
      const log = await EmailLogModel.findById(id);
      if (log) {
        log.openCount = (log.openCount || 0) + 1;
        if (!log.firstOpenedAt) log.firstOpenedAt = new Date();
        log.lastOpenedAt = new Date();
        await log.save();
      }
    } catch (err) {
      // ignore
    }
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.send(this.tinyPng);
  }

  // Redirect that updates click counts: /api/email/redirect?logId=xxx&url=encodedUrl
  @Get('redirect')
  async redirect(@Query('logId') logId: string, @Query('url') url: string, @Res() res: Response) {
    try {
      const dest = url ? decodeURIComponent(String(url)) : '/';
      const log = await EmailLogModel.findById(logId);
      if (log) {
        log.clickCount = (log.clickCount || 0) + 1;
        // find or push link
        const existing = (log.links || []).find((l: any) => l.url === dest);
        if (existing) existing.clicks = (existing.clicks || 0) + 1;
        else log.links = (log.links || []).concat([{ id: String(Date.now()), url: dest, clicks: 1 }]);
        await log.save();
      }
    } catch (err) {
      // ignore
    }
    return res.redirect(302, url ? decodeURIComponent(String(url)) : '/');
  }
}
