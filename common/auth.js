const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")


/** The saltRound **/
let saltRound = 10;

/** The hashPassword Function **/
/** req.body.password(password) is passed parameter in hashPassword function **/
const hashPassword = async(password) => {
    /** The salt create **/
    let salt = await bcryptjs.genSalt(saltRound)

    /** The parameter password and salt gendrate hashed password **/
    let hidePassword = await bcryptjs.hash(password, salt)
    /** Retuen the hidePassword **/
    return hidePassword;
}

/** --------------------------------------------------------------------------------------- */

/** The hashCompare Function **/
/** The req.body.password(password) and user.password(hashedPassword) in passed in parameter in hashCompare function **/
const hashCompare = async(password, hashedPassword) => {
     /** Compare the req.body.password(password) and user.password(hashedPassword) and Return the function**/ 
   return await bcryptjs.compare(password, hashedPassword)
}

/** --------------------------------------------------------------------------------------- */

/** CREATE A TOKEN IN JWT */
const createToken = async(payload)=>{
      let token = await jwt.sign(payload, process.env.secretKey, {expiresIn: "2m"})
      // console.log(token);
      return token;
}

/** --------------------------------------------------------------------------------------- */

/** Validate a token next middleware **/
const validate = async(req, res, next)=>{
   /** req.headers.authorization get a Token **/
   if(req.headers.authorization){
        let token = req.headers.authorization.split(" ")[1]
         // console.log('TOKEN', token);

      /** Token decoded and get iat and exp */
        let data = await jwt.decode(token)
        // console.log("DATA.EXP", data.exp);   
        
      /** +new -> number formater **/  
      /** (+new Date())/1000) courrent time divided by 1000 convert the secound **/
      /* The courrent time less than exp time **/
      /** The if condition is true and execute **/
        if(Math.floor((+new Date())/1000) < data.exp)
           /** The if condition is true the next() middleware is executed **/
             next()
        else
          res.status(402).send({
            message: "Token Expired..."
          }) 
        
   }else{
      res.status(400).send({
          message: "Token Not Found..."
      })
   }
} 

/** --------------------------------------------------------------------------------------- */

/** roleAdmin Function */
/** the user get a role admin the function execute */
const roleAdmin = async(req, res, next)=>{
   /** req.headers.authorization get a Token **/
   if(req.headers.authorization){
        let token = req.headers.authorization.split(" ")[1]
         // console.log('TOKEN', token);

      /** Token decoded and get iat and exp */
        let data = await jwt.decode(token)
        // console.log("DATA.EXP", data.exp);   
        
       /** The user Admin the condition true the if statement execute */ 
        if(data.role === "admin")
           /** The if condition is true the next() middleware is executed **/
             next()
        else
          res.status(402).send({
            message: "Only Admin are Allowed..."
          }) 
        
   }else{
      res.status(400).send({
          message: "Token Not Found..."
      })
   }
}


module.exports = {hashPassword, hashCompare, createToken, validate, roleAdmin}