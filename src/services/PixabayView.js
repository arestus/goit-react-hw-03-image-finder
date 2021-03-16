import React, { Component } from 'react';
import axios from 'axios';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import ImageGalleryItem from './ImageGalleryItem';
import Button from './Button';
import Loader from './Loader';
import Modal from './Modal';

class PixabayView extends Component {
  state = {
    hits: [],
    currentPage: 1,
    searchQuery: '',
    isLoading: false,
    error: null,
    selectedImg: '',
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.fetchPages();
    }
  }

  onChangeQuery = query => {
    this.setState({
      searchQuery: query,
      currentPage: 1,
      hits: [],
      error: null,
      selectedImg: '',
      showModal: false,
    });
  };

  fetchPages = () => {
    const { currentPage, searchQuery } = this.state;

    this.setState({ isLoading: true });

    axios
      .get(
        `https://pixabay.com/api/?q=${searchQuery}&page=${currentPage}&key=19998766-bc5c9aa883552721d0d63d23f&image_type=photo&orientation=horizontal&per_page=12`,
      )
      .then(response => {
        this.setState(prevState => ({
          hits: [...prevState.hits, ...response.data.hits],
          currentPage: prevState.currentPage + 1,
        }));
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ isLoading: false }));
  };

  setLargeImg = image => {
    this.setState({ selectedImg: image.largeImageURL });
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  render() {
    const { hits, isLoading, error, showModal, selectedImg } = this.state;
    const shouldRenderLoadMoreButton = hits.length > 0 && !isLoading;

    return (
      <div>
        {error && <h1> Ой, ошибка</h1>}
        <Searchbar onSubmit={this.onChangeQuery} />

        <ImageGallery>
          {hits.map(hit => (
            <ImageGalleryItem
              key={hit.id}
              hit={hit}
              setLargeImg={this.setLargeImg}
            />
          ))}
        </ImageGallery>

        {isLoading && <Loader />}

        {shouldRenderLoadMoreButton && <Button loadMore={this.fetchPages} />}

        {showModal && (
          <Modal largeImgUrl={selectedImg} onClose={this.toggleModal} />
        )}
      </div>
    );
  }
}

export default PixabayView;

// import axios from 'axios';

// const API_KEY = process.env.REACT_APP_API_KEY;
// const BASE_URL = 'https://pixabay.com/api/';

// function fetchPages({ query = '', page = 1, perPage = 12 }) {
//   return axios
//     .get(
//       `${BASE_URL}?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${perPage}`,
//     )
//     .then(response => response.data.hits);
// }

// export { fetchPages };
