const express = require(express);
const appRouter = express.Router();

appRouter.get("/logout", async(req, resp)=>{
   resp.cookies("token", null, {expires:new Date(Date.now())});
   resp.send("log out succesfully");
})


module.exports = authRouter;