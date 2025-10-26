export class TokenManager {
  static getToken() {
    return localStorage.getItem('authToken');
  }

  static setToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  static clearToken() {
    localStorage.removeItem('authToken');
  }

  static isTokenExpired(token: string) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  static isAuthenticated() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }
}
