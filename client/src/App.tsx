import { useEffect, useState } from 'react';

export default function App() {
  const [image, setImage] = useState('Image Placeholder :)');

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:3000/image`);
    eventSource.onmessage = (e) => setImage(e.data);
    return () => {
      eventSource.close();
    };
  }, [])

  return <div className="App">
    <p>{image}</p>
  </div>;
}
