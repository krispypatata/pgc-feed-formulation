import { Liveblocks } from "@liveblocks/node";
import dotenv from 'dotenv';
dotenv.config();

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET,
});


const handleLiveblocksAuth = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = req.user; // This contains the user from the database (given by Passport)
  console.log("userL:", user);
// Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(
    user._id.toString(),
    {
      userInfo: {
        name: user.displayName,
        email: user.email,
        avatar: user.profilePicture,
      }
    }
  );

  session.allow(`formulation-*`, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return res.status(status).end(body);


};

export default handleLiveblocksAuth;

