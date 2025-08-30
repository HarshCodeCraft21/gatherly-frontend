import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, Calendar, Users } from "lucide-react";
import { useState, useEffect } from "react";
import AvatarSelector from "@/components/AvatarSelector";
import avatar from "@/assets/avatars/placeholder.png";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { TOTALCREATEDEVENT, TOTALREGISTEREVENT, DELETE_EVENT } from '../api/api.js';

interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
}

interface DecodedToken {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
}

const UserProfile = () => {
    const [user, setUser] = useState<DecodedToken | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState(avatar);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("JwtToken");
            if (token) {
                const decoded: DecodedToken = jwtDecode(token);
                console.log(decoded)
                setUser(decoded);

                // Avatar restore
                const stored = localStorage.getItem(`avatar-${decoded.id}`);
                if (stored) setSelectedAvatar(stored);

                // Fetch events
                if (decoded.role === "admin") {
                    await axios.get(TOTALCREATEDEVENT, {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials:true
                    }).then(res => setEvents(res.data.Events));
                } else {
                    await axios.get(TOTALREGISTEREVENT, {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials:true
                    }).then(res => setEvents(res.data.evntDetails))
                }
            }
        }
        fetchUserData();
    }, []);



    const handleAvatarSelect = (avatarSrc: string) => {
        if (!user) return;
        setSelectedAvatar(avatarSrc);
        localStorage.setItem(`avatar-${user.id}`, avatarSrc);
    };

    const handleEditEvent = (eventId: string) => {
        console.log(`Edit event ${eventId}`);
    };

    const handleDeleteEvent = async (eventId: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${DELETE_EVENT}/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials:true
            });
            setEvents(prev => prev.filter(e => e.id !== eventId)); // UI update
        } catch (err) {
            console.error("Delete failed", err);
        }
    };


    if (!user) return <p className="text-center mt-20">Loading profile...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-purple-light/30 to-background p-6 mt-20">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Profile Header */}
                <Card className="p-8 shadow-lg border-purple-light/50 bg-gradient-to-r from-card to-purple-light/10">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24 ring-4 ring-purple-primary/20">
                                <AvatarImage src={selectedAvatar} alt={user.name} />
                                <AvatarFallback className="text-2xl bg-purple">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <AvatarSelector
                                currentAvatar={selectedAvatar}
                                onAvatarSelect={handleAvatarSelect}
                            />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
                            <p className="text-lg text-muted-foreground mb-3">{user.email}</p>
                            <Badge
                                variant={user.role === "admin" ? "default" : "secondary"}
                                className="text-sm px-4 py-1"
                            >
                                {user.role === "admin" ? "Administrator" : "User"}
                            </Badge>
                        </div>
                    </div>
                </Card>

                {/* Events Section */}
                {user.role === "user" ? (
                    <Card className="p-6 shadow-lg border-purple-light/50">
                        <div className="flex items-center gap-3 mb-6">
                            <Calendar className="h-6 w-6 text-purple-primary" />
                            <h2 className="text-2xl font-semibold">Registered Events</h2>
                        </div>
                        <div className="space-y-4">
                            {events.map((event, index) => (
                                <Card key={index} className="p-4 border-purple-light/30 hover:border-purple-primary/50 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg text-foreground">{event.title}</h3>
                                            <p className="text-muted-foreground text-sm mb-2">{event.description}</p>
                                            <p className="text-purple-primary font-medium">{new Date(event.date).toLocaleDateString()}</p>
                                        </div>
                                        <Badge variant="outline" className="border-purple-primary/30 text-purple-primary">
                                            Registered
                                        </Badge>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Card>
                ) : (
                    <Card className="p-6 shadow-lg border-purple-light/50">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="h-6 w-6 text-purple-primary" />
                            <h2 className="text-2xl font-semibold">{events.length === 0 ? "No Event Created Yet." : "Events Manage Here"}</h2>
                            <Badge className="ml-auto bg-purple-primary text-white">
                                {events.length} Events Created
                            </Badge>
                        </div>
                        <div className="space-y-4">
                            {events.map((event) => (
                                <Card key={event.id} className="p-4 border-purple-light/30 hover:border-purple-primary/50 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-foreground">{event.title}</h3>
                                            <p className="text-muted-foreground text-sm mb-2">{event.description}</p>
                                            <p className="text-purple-primary font-medium">{new Date(event.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditEvent(event.id)}
                                                className="border-purple-primary/30 text-purple-primary hover:bg-purple-primary hover:text-white"
                                            >
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteEvent(event.id)}
                                                className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
