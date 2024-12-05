const supabase = require('../config/supabase');

const fetchEmployees = async (req, res) => {
    const { currentEmployeeId } = req.query; // Pass the current user ID as a query parameter.
    try {
        const { data, error } = await supabase
            .from('users')
            .select('user_id, user_name')
            .eq('role', 'Employee')
            .neq('user_id', currentEmployeeId)

        if (error) throw error;

        res.status(200).json({
            employees: data
        })
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch employees'
        });
    }
}




const updateShipment = async (req, res) => {
    const { shipment_id, new_user_id, job_order_details } = req.body;

    try {
        // Step 1: Fetch the current shipment details
        const { data: currentShipment, error: fetchError } = await supabase
            .from('shipments')
            .select('shipment_id, user_id, current_user_name, job_order') // Fetch both user_id and job_order
            .eq('shipment_id', shipment_id)
            .single();

        if (fetchError) throw new Error(`Failed to fetch shipment: ${fetchError.message}`);

        // Step 2: If new_user_id is provided, fetch the user name from the users table
        let newUser = null;
        if (new_user_id) {
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('user_name') // Fetch user_name
                .eq('user_id', new_user_id)
                .single();

            if (userError) throw new Error(`Failed to fetch user: ${userError.message}`);
            newUser = userData; // Store the user details
        }

        // Step 3: Log history of the shipment
        const { error: historyError } = await supabase
            .from('shipment_history')
            .insert({
                shipment_id: shipment_id,
                prev_user_id: currentShipment.user_id,
                prev_user_name: currentShipment.current_user_name,
                prev_job_order: currentShipment.job_order,
            });

        if (historyError) throw new Error(`Failed to log shipment history: ${historyError.message}`);

        // Step 4: Prepare update data
        const updateData = {};

        // Only add user_id and current_user_name if new_user_id is provided
        if (new_user_id) {
            updateData.user_id = new_user_id;
            updateData.current_user_name = newUser.user_name; // Add the user_name
        }

        // Only add job_order if job_order_details is provided
        if (job_order_details) {
            updateData.job_order = job_order_details;
        }

        // Step 5: Check if there is any data to update
        if (Object.keys(updateData).length === 0) {
            // No updates provided, return a message indicating no changes
            return res.status(400).json({
                success: false,
                message: 'No update data provided.',
            });
        }

        // Step 6: Perform the update if there is data to update
        const { error: updateError } = await supabase
            .from('shipments')
            .update(updateData)
            .eq('shipment_id', shipment_id);

        if (updateError) throw new Error(`Failed to update shipment: ${updateError.message}`);

        // Step 7: Insert into job_order only if job_order_details is provided
        if (job_order_details) {
            const { error: jobOrderError } = await supabase
                .from('job_order')
                .insert({
                    shipment_id: shipment_id,
                    order_details: job_order_details,
                });

            if (jobOrderError) throw new Error(`Failed to insert job order: ${jobOrderError.message}`);
        }

        // Step 8: Send success response
        res.status(200).json({
            success: true,
            message: 'Shipment updated successfully',
        });
    } catch (error) {
        console.error('Update Shipment Failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Update Shipment Failed',
        });
    }
};




module.exports = {
    fetchEmployees,
    updateShipment,


}