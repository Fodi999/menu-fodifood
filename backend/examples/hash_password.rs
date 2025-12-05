fn main() {
    let password = "admin123";
    let hash = bcrypt::hash(password, bcrypt::DEFAULT_COST).expect("Failed to hash password");
    println!("Password: {}", password);
    println!("Hash: {}", hash);
    println!("\nAdd this to your .env file:");
    println!("ADMIN_PASSWORD_HASH={}", hash);
}
