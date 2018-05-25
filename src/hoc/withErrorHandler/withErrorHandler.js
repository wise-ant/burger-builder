import React, {Component} from 'react';
import Aux from '../Aux/Aux';
import Modal from '../../components/UI/Modal/Modal';
import axios from '../../axios-orders'

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state={
      error: null,
    }

    //we cant do it in componentWillMount case we do not,
    //cause any side effects we just register interceptors,
    //we need it here cause it should trigger before componentDidMount
    //of child(BurgerBuilder) or we'll not see error
    componentWillMount(){
      this.requestInterceptor = axios.interceptors.request.use(req=>{
        this.setState({error: null})
        return req;
      })
      this.responseInterceptor = axios.interceptors.response.use(res=>res, error =>{
        this.setState({error})
      })
    }

    componentWillUnmount(){
      axios.interceptors.request.eject(this.requestInterceptor)
      axios.interceptors.response.eject(this.responseInterceptor)
    }

    errorConfirmedHandler = () => {
      this.setState({error: null})
    }

    render(){
      return(
        <Aux>
          <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      )
    }
  }
}

export default withErrorHandler;
