// Run this example by adding <%= javascript_pack_tag 'app' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios';
import List from './components/list'
import Post from './components/post'
import PostForm from './components/postform';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      showPost: false,
      postFormVisible: false,
      view: 'list',
      posts: [],
      post: {}
    }
  }

  getPosts = () => {
    axios.get('/posts.json')
    .then((res) => this.setState({ posts: res.data }) )
    .catch((err) => console.log(err.response.data) );
  }

  getPost = (url) => {
    axios.get(`${url}`)
      .then((res) => this.setState({ post: res.data, showPost: true, view: 'show' }) )
      .catch((err) => console.log(err.response.data) );
  }

  showPostForm = (url) => {
    axios.get(`${url}`)
      .then((res) => this.setState({ post: res.data, postFormVisible: true, view: 'form' }) )
      .catch((err) => console.log(err.response.data) );
  }

  deletePost = (id) => {
    alert('Are you sure?');
    const newPostsState = this.state.posts.filter((post) => post.id !== id );

    axios.delete(`/posts/${id}.json`)
    .then((res) => this.setState({ posts: newPostsState }))
    .catch((err) => console.log(err.response.data));
  }

  goBack = () => {
    this.setState({ showPost: false, view: 'list' })
  }

  performSubmissionRequest = (data, id) => {
    if (id) {
      return axios.patch(`/posts/${id}.json`, data);
    } else {
      return axios.post(`/posts`, data);
    }
  }

  submitPost = (data, id) => {
    this.performSubmissionRequest(data, id)
      .then((res) => this.setState({ postFormVisible: false, view: 'list' }) )
      .catch((err) => console.log(err.response.data) );
  }

  togglePost = () => {
    this.setState({
      view: 'form',
      post: {}
    })
  }

  render() {
    const { showPost, postFormVisible, posts, post } = this.state;

    return (
      <div className="col-sm-12 col-md-10 col-8 col-mx-auto">
        {(() => {
          switch (this.state.view) {
            case "list":  return <List
              getPosts={this.getPosts}
              posts={posts}
              getPost={this.getPost}
              deletePost={this.deletePost}
              showPostForm={this.showPostForm}
              togglePost={this.togglePost}
            />;
            case "show":  return <Post
              post={post}
              showPostForm={this.showPostForm}
              goBack={this.goBack} />;
            case "form":  return <PostForm
              post={post}
              getPost={this.getPost}
              goBack={this.goBack}
              submitPost={this.submitPost} />;
            default:      return <List
              getPosts={this.getPosts}
              posts={posts}
              getPost={this.getPost}
              deletePost={this.deletePost}
              showPostForm={this.showPostForm} />;
          }
        })()}
      </div>

    );
  }
}

export default App;