const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient('https://qyehkxpcihwpyqyyqbhc.supabase.co', 'sb_publishable_BUczckz0frSUl9MP55zGrQ_PHaJG6LB');

async function testPassword() {
    const { data: user } = await supabase.from('admin_users').select('*').eq('email', 'taetule@gmail.com').single();
    if (!user) {
        console.log("User not found");
        return;
    }

    console.log("Found user hash:", user.password_hash);

    const isValid = await bcrypt.compare('admin123', user.password_hash);
    console.log("Is 'admin123' valid?", isValid);

    const isValidWithSpace = await bcrypt.compare('admin123 ', user.password_hash);
    console.log("Is 'admin123 ' valid?", isValidWithSpace);
}

testPassword();
