const formatResponse = (data, status = 200) =>{
    return{
        status,
        data
    }
}

export formatResponse;