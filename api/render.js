import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const { url } = req.query;

  // URL 파라미터가 없거나 http/https 형식이 아니면 오류 처리
  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: '올바른 url 파라미터가 필요합니다.' });
  }

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new', // puppeteer 최신 버전은 'new' 사용 권장
    });

    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle0', // HTML 내부 리소스 로드 완료까지 기다림
      timeout: 30000,
    });

    // 페이지 전체를 PNG로 스크린샷 캡처
    const buffer = await page.screenshot({ type: 'png', fullPage: true });
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  } catch (error) {
    console.error('렌더링 실패:', error);
    res.status(500).json({ error: '이미지 렌더링 중 오류 발생' });
  }
}
