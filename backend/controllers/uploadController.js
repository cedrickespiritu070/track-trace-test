const supabase = require('../config/supabase');  // Import the initialized Supabase client
const SUPABASE_URL = 'https://voyjhuqdrudltkzfxsfs.supabase.co';  // Replace with your Supabase URL

const uploadController = {
  uploadFile: async (req, res) => {
    const { shipment_id, uploaded_by, document_title } = req.body; // Get document_title from body
    const file = req.file;

    if (!file || !shipment_id || !uploaded_by || !document_title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Construct a unique filename
      const fileName = `${Date.now()}-${file.originalname}`;

      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')  // The name of your Supabase storage bucket
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        console.error('Upload Error:', error);
        return res.status(500).json({ error: error.message });
      }

      // Construct the file URL after upload
      const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/documents/${fileName}`;

      // Insert document metadata into the Supabase database
      const { data: insertData, error: insertError } = await supabase
        .from('documents')
        .insert([{
          shipment_id,
          uploaded_by,
          document_title,  // Store the document title here
          document_name: file.originalname,
          document_url: fileUrl,  // Store the file URL in the database
          uploaded_at: new Date().toISOString(),
        }]);

      if (insertError) {
        console.error('Database Insert Error:', insertError);
        throw new Error(`Database Insert Error: ${insertError.message}`);
      }

      res.status(200).json({
        message: 'File uploaded and metadata saved successfully!',
        data: insertData,
      });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = uploadController;
