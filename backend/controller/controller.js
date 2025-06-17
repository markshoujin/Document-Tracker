// controller.js
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../supa.js';
const SECRET_KEY = '100100';


// Make sure you have a secret for signing JWTs (store this securely in env vars)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user by username
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('*')
      .eq('username', username)
      .single();

    if (userError || !user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Fetch user's department(s)
    const { data: userDepartments, error: depError } = await supabase
      .from('user_department')
      .select('dept_idNo, department (department_name)')
      .eq('user_idNo', user.user_no);

    if (depError) {
      console.error('Error fetching user departments:', depError);
    }

    const department_name = userDepartments?.[0]?.department?.department_name || null;

    // Prepare payload for JWT
    const payload = {
      id: user.id,
      username: user.username,
      type: user.type,
      department_name,
      user_idNo: user.user_no,
    };

    // Create token (expires in 1 day)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    // Return token to client
    res.json({
      message: 'Login successful',
      token,
      user: payload,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const user = async (req, res) => {
  try {
    const { data, error } = await supabase.from('user').select('*');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const getDocuments = async (req, res) => {
  try {
    const { data, error } = await supabase.from('document').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLoginUser = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user')
      .select(`
        *,
        user_department (
          dept_idNo,
          department (
            department_name
          )
        )
      `);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: err.message });
  }
};

export const isAuthenticated = (req, res, next) => {
  // If you want to add some custom logic, do it here
  // For now, just call next()
  next();
};

export const logout = async (req, res) => {
  // Optionally clear any cookies or client-side state (if you’re storing the token there)
  res.json({ message: 'Client should remove the access token. User logged out.' });
};

export const addDocument = async (req, res) => {
  const { id, title, description } = req.body;

  try {
    const { data, error } = await supabase
      .from('document')
      .insert([
        {
          document_no: id,
          document_name: title,
          document_desc: description,
          document_status: 'active',
        }
      ])
      .select(); // optional: return the inserted row(s)

    if (error) throw error;

    res.json(data); // return inserted document(s)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getTracking = async (req, res) => {
  const documentNo = req.query.documentNo;

  try {
    const { data, error } = await supabase
  .from('document_tracking')
  .select(`
    *,
    user:transaction_user (
      user_no,
      username,
      user_department (
        dept_idNo,
        department (
          department_name
        )
      )
    ),
    document (
      document_no,
      document_name
    )
  `)
  .eq('transaction_no', documentNo)
  .order('idNo', { ascending: false })
  .limit(1);


    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateLastTransaction = async (req, res) => {
  const idNo = req.body.data?.[0]?.idNo;

  if (!idNo) {
    return res.status(400).json({ error: 'Missing idNo in request body' });
  }

  try {
    const { data, error } = await supabase
      .from('document_tracking')
      .update({ transaction_status: 'Complete' })
      .eq('idNo', idNo)
      .select(); // optional: return updated row

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getLastTransaction = async (req, res) => {
  try {
    const { q } = req.query;

    // Fetch the most recent transaction
    const { data, error } = await supabase
      .from('document_tracking')
      .select('*')
      .order('idNo', { ascending: false })
      .limit(1);

    if (error) throw error;

    // Filter results manually if query param `q` is provided
    if (q) {
      const keys = ['transaction_no'];
      const filtered = data.filter((item) =>
        keys.some((key) =>
          item[key]?.toLowerCase?.().includes(q.toLowerCase())
        )
      );
      return res.json(filtered);
    }

    return res.json(data);
  } catch (err) {
    console.error('Supabase error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addTracking = async (req, res) => {
  const transaction_no = req.body.id;
  const transaction_user = req.session?.user?.user_idNo;
  const transaction_time = dayjs().format('YYYY-MM-DD HH:mm:ss');

  if (!transaction_no || !transaction_user) {
    return res.status(400).json({ error: 'Missing transaction data' });
  }

  try {
    const { data, error } = await supabase
      .from('document_tracking')
      .insert([
        {
          transaction_no,
          transaction_user,
          transaction_time,
          transaction_status: 'Ongoing',
        },
      ])
      .select(); // returns the inserted row(s)

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getTimeline = async (req, res) => {
  const documentNo = req.query.documentNo;

  if (!documentNo) {
    return res.status(400).json({ error: 'Missing documentNo query parameter' });
  }

  try {
    const { data, error } = await supabase
  .from('document_tracking')
  .select(`
    *,
    user:transaction_user (
      user_no,
      username,
      user_department (
        dept_idNo,
        department (
          department_name
        )
      )
    ),
    document (
      document_no,
      document_name,
      document_desc
    )
  `)
  .eq('transaction_no', documentNo)
  .order('idNo', { ascending: false });


    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getUserDocument = async (req, res) => {
  const userId = req.query?.user_idNo;
  
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const { data, error } = await supabase
      .from('document_tracking')
      .select(`
        *,
        document (
          document_no,
          document_name,
          document_desc,
          document_status
        )
      `)
      .eq('transaction_user', userId);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};