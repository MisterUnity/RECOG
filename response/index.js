module.exports = {
  errorResp(){
    return {
      status: 0,
      result: 'Some error occured !!'
    }
  },
  normalResp(){
    return {
      status: 1,
      result: 'Normal end.'
    }
  },
  normalRespWithData (data) {
    return {
      status: 1,
      result: data
    }
  }
};
