const bcrypt = require('bcryptjs'); // Import bcrypt for password comparison
const supabase = require('../config/supabase');

const changePassword = async (req, res) => {
  const { user_id, newPassword, edited_by, edited_by_username } = req.body;

  if (!user_id || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { data, error } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('user_id', user_id)
      .select('*'); // Explicitly return the updated data

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }


    // Fetch the user's name for the notification message
    const { data: userData, error: userError } = await supabase
    .from('users')
    .select('user_name')
    .eq('user_id', user_id)
    .single();

    if (userError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user details for notification'
      });
    }
    const message = `Password for employee ${userData.user_name} has been changed successfully.`;

    // Insert a notification into the 'notification' table
    const { error: notificationError } = await supabase
      .from('notification')
      .insert([
        {
          user_id: edited_by,
          message: message,
          created_at: new Date(),
          type: 'edit password',
          user_name: edited_by_username
        }
      ]);

    if (notificationError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create notification'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {

  }
}

const deleteUser = async (req, res) => {
  const { user_id, deleted_by, deleted_by_username } = req.body;

  if (!user_id || !deleted_by) {
    return res.status(400).json({
      success: false,
      message: 'User ID and Superadmin ID are required',
    });
  }

  try {
    // Fetch user details
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('user_name')
      .eq('user_id', user_id)
      .single();

    if (fetchError || !userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userName = userData.user_name;

    // Delete the user
    const { count, error: deleteError } = await supabase
      .from('users')
      .delete({ returning: 'count' })
      .eq('user_id', user_id);

    if (deleteError || count === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found or already deleted',
      });
    }

    // Insert notification
    const { error: notificationError } = await supabase
      .from('notification')
      .insert([
        {
          user_id: deleted_by,
          user_name: deleted_by_username,
          message: `User "${userName}" has been deleted.`,
          created_at: new Date().toISOString(),
          type: 'user minus'
        },
      ]);

    if (notificationError) {
      console.error('Supabase notification error:', notificationError);
      return res.status(500).json({
        success: false,
        message: 'User deleted, but failed to log notification.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `User "${userName}" deleted successfully`,
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};



const overallTotalShipments = async (req,res) => {
  try {
    const {data, error} = await supabase
    .from('shipments')
    .select('*')

    if (error) throw error;
    res.status(200).json({
      overallTotalShipments: data.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch overall total shipments'
    })
    
  }
}


const activeShipments = async (req, res) => {
  try {
    const {data, error} = await supabase
    .from('shipments')
    .select('*')
    .neq('status', 'Delivered')
    .neq('status', 'Order Placed');


    if (error) throw error;    
    res.status(200).json({
      activeShipments: data.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch active shipments'
    })
    
  }
}

const activeEmployees = async (req, res) => {
  try {
    const {data, error} = await supabase
    .from('users')
    .select(`
      user_id,
      user_name,
      role,
      department,
      shipments(shipment_id, tracking_no, user_id, status)
    `)
    .eq('role', 'Employee')
    .eq('shipments.status','Delivered')

    if (error) throw error;
    res.status(200).json({
      activeEmployees: data
    })
  } catch (error) {
    console.log('Error fetching active employees:', error);

  }
  
}


const upcomingShipments = async (req, res) => {
  try{
  const {data, error} = await supabase
    .from('shipments')
    .select('*')
    .eq('status', 'Order Placed')

    if (error) throw error;
    res.status(200).json({
      upcomingShipments: data.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch upcoming shipments'
    })
  }
}

const completedShipments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('shipments')
      .select('status')
      .eq('status', 'Delivered')

      if (error) throw error
    
      res.status(200).json({
        completedShipments: data.length
      })
  } catch (error) {
    
  }
}
module.exports = { 
  overallTotalShipments, 
  activeShipments,
  upcomingShipments,
  completedShipments,
  activeEmployees,
  changePassword, 
  deleteUser 
};