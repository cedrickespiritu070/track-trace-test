const bcrypt = require('bcryptjs'); // Import bcrypt for password comparison
const jwt = require("jsonwebtoken");
const supabase = require('../config/supabase');

// REGISTER CONTROLLER

const registerUser = async (req, res) => {
  const { userName, password, department, role, created_by_id, created_by_username } = req.body;

  // Basic validation
  if (!userName || !password || !department || !role) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required.'
    });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user data
    const { data: user, error: userError } = await supabase.from('users').insert([
      {
        user_name: userName,
        department: department,
        role: role || 'Employee',
        password: hashedPassword, // Store hashed password
      },
    ]).select(); // Include `select()` to return the inserted user

    if (userError) throw userError;

    // Insert notification
    const { error: notificationError } = await supabase.from('notification').insert([
      {
        user_id: created_by_id, // Assuming 'id' is the primary key in the 'users' table
        user_name: created_by_username,
        message: `User ${userName} has been registered successfully.`,
        created_at: new Date().toISOString(),
        type: 'user add'
      },
    ]);

    if (notificationError) throw notificationError;

    res.status(200).json({
      success: true,
      message: "User created successfully"
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}

//LOGIN CONTROLLER
const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  // Validate input
  if (!userName || !password)
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });

  try {
    // Query to get the user by username from the Supabase table
    const { data, error } = await supabase
      .from('users')
      .select('user_id, role, password, user_name, shipment_count') // Include shipment_count
      .eq('user_name', userName)
      .single();

    if (error || !data) {
      return res.status(400).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const { user_id, role, user_name, password: hashedPassword, shipment_count } = data;

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    // Successfully logged in, send back the user_id, role, user_name, and shipment_count
    //   res.status(200).json({ user_id, role, user_name, shipment_count }); ??????????
    const token = jwt.sign({
      id: user_id,
      role: role,
      user_name: user_name,
      shipment_count: shipment_count // dont think this is necessary
    }, jwtSecret, { expiresIn: '1d' });

    res.cookie('token', token, { httpOnly: true, secure: false }).json({
      success: true,
      message: 'Logged in successfully',
      user: {
        id: user_id,
        role: role,
        user_name: user_name
      }
    })

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
//LOGOUT CONTROLLER
const logoutUser = (req, res) => {

  res.clearCookie('token').json({
    success: true,
    message: "Logged out successfully"
  })

}

//MIDDLEWARE
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({
    success: false,
    message: "Unauthorize User!"
  })

  try {
    const jwtSecret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorize User!"
    })
  }
}
module.exports = { registerUser, loginUser, logoutUser, authMiddleware };