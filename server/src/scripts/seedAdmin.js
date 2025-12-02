import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('Admin account already exists.');
      return;
    }

    await User.create({
      name: 'Super Admin',
      email: 'admin@coursemaster.com',
      password: 'adminpassword123', 
      role: 'admin'
    });

    console.log(' Admin account created successfully!');
    console.log('Email: admin@coursemaster.com');
    console.log('Password: adminpassword123');

  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

export default seedAdmin;