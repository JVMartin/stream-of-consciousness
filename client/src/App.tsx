import { useEffect, useState } from 'react';

import { ImageDto } from '../../server/src/types/image.dto';

export default function App() {
  const [image, setImage] = useState<ImageDto>({ url: '', tweetUrl: '', tweet: ''});
  const [paused, setPaused] = useState<boolean>(false);


  function buttonClick() {
    if (paused) {
      setPaused(false);
    } else {
      setPaused(true);
    }
  }

  useEffect(() => {
    if (paused) {
      return () => {};
    } else {
      const eventSource = new EventSource(`http://localhost:8080/image`);
      eventSource.onmessage = (e) => {
        const data: ImageDto = JSON.parse(e.data);
        setImage(data);
      };
      return () => {
        eventSource.close();
      };
    }
  }, [paused])

  let imageArea;
  if (image && image.url.length) {
    imageArea = <img src={image.url} className="mx-auto" />;
  } else {
    imageArea = <p>Waiting for first image...</p>;
  }

  let pauseButton = null;
  if (image && image.url.length) {
    pauseButton =
      <button onClick={buttonClick} className="mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {paused ? 'Resume' : 'Pause'}
      </button>
  }

  return <div className="App">
    <section className="py-5">
      <div className="container mx-auto max-w-2xl flex items-center">
        {pauseButton}
      </div>
      <div className="py-5 container mx-auto max-w-2xl">
        <div>
          {imageArea}
        </div>
        <div>
          <p>
            {image.tweet}
            &nbsp;
            {image.tweetUrl ? (<a href={image.tweetUrl} target="_blank">Link</a>) : null}
          </p>
        </div>
      </div>
    </section>
  </div>;
}
