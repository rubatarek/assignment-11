import {Router} from "express"
import { getUserData ,updateUserData,deleteUser,deactivateUser,activateUser} from "./user.service.js"
import { SuccessResponse } from "../../common/response/success.response.js"
import { auth } from "../../common/middleware/auth/auth.js"

const router=Router()



router.get('/get-user-data',auth, async (req, res) => {
    let userData= await getUserData(req.user)
    SuccessResponse({
        res,
        message: "User data ", 
        data: userData
    })
})
  
router.put('/update-user-profile',auth, async (req, res) => {

let updatedUserData= await updateUserData(req.user, req.body)
SuccessResponse({
    res,
    message: "User data updated successfully",
    data: updatedUserData
})
})

router.delete('/delete-user', auth, async (req, res) => {
    let deletedUser = await deleteUser(req.user);
    SuccessResponse({
        res,
        message: "User deleted successfully",
        data: deletedUser
    });
});
router.put('/deactivate-user', auth, async (req, res) => {
    let user = await deactivateUser(req.user);
    SuccessResponse({
        res,
        message: "User deactivated successfully",
        data: user
    });
});

router.put('/activate-user', auth, async (req, res) => {
    let user = await activateUser(req.user);
    SuccessResponse({
        res,
        message: "User activated successfully",
        data: user
    });
});


export default router