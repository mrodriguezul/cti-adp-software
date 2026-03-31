export class Client {
  constructor(
    public readonly id: number,
    public readonly firstname: string,
    public readonly lastname: string,
    public readonly email: string,
    public readonly password: string,
    public readonly status: string,
    public readonly phone: string | null = null,
    public readonly address: string | null = null
  ) {}

  public isActive(): boolean {
    return this.status === 'A';
  }

  public toJSON(): {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string | null;
    address: string | null;
    status: string;
  } {
    return {
      id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      phone: this.phone,
      address: this.address,
      status: this.status
    };
  }
}
