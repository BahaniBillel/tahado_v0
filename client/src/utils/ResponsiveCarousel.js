import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

export default class NextJsCarousel extends Component {
  // Function to render custom thumbnails
  renderThumb = (images) => {
    return images.map((image, index) => (
      <div key={index}>
        <Image src={image} alt={`thumb${index}`} width={100} height={100} />
      </div>
    ));
  };

  render() {
    const { data } = this.props;

    return (
      <div>
        <Carousel showThumbs={true} renderThumbs={() => this.renderThumb(data)}>
          {data.map((image, index) => (
            <div key={index}>
              <Image
                src={image}
                alt={`image${index}`}
                width={1000}
                height={1000}
              />
            </div>
          ))}
        </Carousel>
      </div>
    );
  }
}
