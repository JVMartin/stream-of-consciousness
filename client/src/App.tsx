import { useEffect, useState } from 'react';

export default function App() {
  const [image, setImage] = useState('Image Placeholder :)');

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

  return <div className="App">
    <p>{image}</p>
  </div>;
}
