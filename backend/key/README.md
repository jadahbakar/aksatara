source : https://auth0.com/blog/brute-forcing-hs256-is-possible-the-importance-of-using-strong-keys-to-sign-jwts/ 
how to run it : 
    openssl ecparam -name prime256v1 -genkey -noout -out ecdsa_private_key.pem
    openssl ec -in ecdsa_private_key.pem -pubout -out ecdsa_public_key.pem