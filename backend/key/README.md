source : https://auth0.com/blog/brute-forcing-hs256-is-possible-the-importance-of-using-strong-keys-to-sign-jwts/ 
how to run it : 
    openssl ecparam -name prime256v1 -genkey -noout -out ecdsa_private_key.pem
    openssl ec -in ecdsa_private_key.pem -pubout -out ecdsa_public_key.pem



# How To Create https request
source : https://timonweb.com/posts/running-expressjs-server-over-https/
        https://servernesia.com/751/langkah-menciptakan-csr-private-key-openssl/
        https://servernesia.com/1684/langkah-sertifikat-ssl-gratis-wosign/
        https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-
        https://dev.to/omergulen/step-by-step-node-express-ssl-certificate-run-https-server-from-scratch-in-5-steps-5b87
how to run it : 
    openssl req -nodes -new -x509 -keyout server.key -out server.cert
    