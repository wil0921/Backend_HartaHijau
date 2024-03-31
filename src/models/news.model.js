const newsData = [
    {
      url: 'https://example.com/news/1',
      thumbnail: 'https://res.cloudinary.com/dfngeo1wz/image/upload/thumbnails/news1.jpg',
      title: 'Headline News 1',
      description: 'Description for headline news 1.'
    },
    {
      url: 'https://example.com/news/2',
      thumbnail: 'https://res.cloudinary.com/dfngeo1wz/image/upload/thumbnails/news2.jpg',
      title: 'Headline News 2',
      description: 'Description for headline news 2.'
    }
  ];
  
  const getNews = () => {
    return newsData;
  };
  
  module.exports = { getNews };
  