import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: '올바른 url 파라미터가 필요합니다.' });
  }

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: 'new',
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    const buffer = await page.screenshot({ type: 'png', fullPage: true });
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  } catch (error) {
    console.error('렌더링 오류:', error.message);
    res.status(500).json({ error: '이미지 렌더링 실패' });
  }
}