import * as bcrypt from 'bcryptjs';

bcrypt.hash('admin123', 10).then(console.log);
