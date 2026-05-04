import { SignJWT, jwtVerify } from "jose";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    return "default-secret-key-for-development-only-change-me";
  }
  return secret;
};

export const signJwt = async (payload: { email: string; name: string; role: string }) => {
  try {
    const secret = new TextEncoder().encode(getJwtSecretKey());
    const alg = "HS256";

    return new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);
  } catch (error) {
    throw error;
  }
};

export const verifyJwt = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(getJwtSecretKey());
    const { payload } = await jwtVerify(token, secret);
    return payload as { email: string; name: string; role: string };
  } catch (error) {
    return null;
  }
};
