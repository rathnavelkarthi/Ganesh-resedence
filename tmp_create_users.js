import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://hrkzztoekcgggrjujyhb.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_EJWhbrbT868wmOzN_rcvxQ_GP2iQvEo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createUsers() {
    const users = [
        { email: 'demo.hotel@demo.com', password: 'Demo@2024', name: 'Hotel Admin' },
        { email: 'demo.restaurant@demo.com', password: 'Demo@2024', name: 'Restaurant Admin' },
        { email: 'demo.combined@demo.com', password: 'Demo@2024', name: 'Resort Admin' }
    ];

    for (const user of users) {
        console.log(`Creating ${user.email}...`);
        const { data, error } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
                data: {
                    name: user.name,
                    role: 'SUPER_ADMIN'
                }
            }
        });

        if (error) {
            console.error(`Error creating ${user.email}:`, error.message);
        } else {
            console.log(`Success! User ID: ${data.user?.id}`);
        }
    }
}

createUsers();
