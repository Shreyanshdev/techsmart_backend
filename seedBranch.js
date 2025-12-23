import axios from 'axios';
import jwt from 'jsonwebtoken';

const seedBranch = async () => {
    try {
        const token = jwt.sign(
            { userId: 'admin_seeder', role: 'Customer' },
            '4f7a3d9b82c1ef457d6a9b32e1c5fabc',
            {
                expiresIn: '1h',
                issuer: "milk-delivery-app",
                audience: "Customer"
            }
        );

        const branchData = {
            name: "LushAndPure Indiranagar",
            address: "100 Feet Rd, Indiranagar, Bangalore",
            location: {
                latitude: 12.9716, // Matches our mock location
                longitude: 77.5946
            }
        };

        const response = await axios.post('http://localhost:3000/api/v1/branches', branchData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Branch seeded successfully:', response.data);
    } catch (error) {
        console.error('Error seeding branch:', error);
    }
};

seedBranch();
