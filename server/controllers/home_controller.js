module.exports.home = function(req, res){  
    res.status(200).send({message:"This is the home page of Server"}).json();
}