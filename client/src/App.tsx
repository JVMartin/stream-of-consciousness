import { useEffect, useState } from 'react';

export default function App() {
  const [image, setImage] = useState('');

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:8080/image`);
    console.log('hello');
    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setImage(data.image);
    };
    return () => {
      eventSource.close();
    };
  }, [])

  let imageArea;
  if (image && image.length) {
    imageArea = <img src={image} className="mx-auto" />;
  } else {
    imageArea = <p>Waiting for first image...</p>;
  }

  return <div className="App">
    <section className="py-5">
      <div className="container mx-auto max-w-2xl">
        {imageArea}
      </div>
    </section>
  </div>;
}
