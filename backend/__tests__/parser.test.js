jest.mock('axios');
const axios = require('axios');
const { parseBlog } = require('../services/parser');

describe('parseBlog function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should parse blog and return expected results', async () => {
    const mockHtml = `
      <article class="widg_newsblock_element">
        <h3><a class="widg_news_link" href="/blog/test-article">Test System Article</a></h3>
        <div class="widg_news_short_doc">Description containing system word</div>
        <div class="widg_news_pub_time">15 сентября 2023 12:30</div>
      </article>
    `;

    axios.get.mockResolvedValue({ data: mockHtml });


    const results = await parseBlog('system', 1);

    expect(results.length).toBe(1);
    expect(results[0]).toEqual({
      link: 'https://is-systems.org/blog/test-article',
      title: 'Test System Article',
      descr: 'Description containing system word',
      date: '2023-09-15 12:30:00',
    });
  });

  it('should return empty array if searchWord is not found', async () => {
    const mockHtml = `
      <article class="widg_newsblock_element">
        <h3><a class="widg_news_link" href="/blog/another-article">Another Article</a></h3>
        <div class="widg_news_short_doc">No keyword here</div>
        <div class="widg_news_pub_time">01 января 2023</div>
      </article>
    `;

    axios.get.mockResolvedValue({ data: mockHtml });

    const results = await parseBlog('system', 1);
    expect(results).toEqual([]);
  });
});
