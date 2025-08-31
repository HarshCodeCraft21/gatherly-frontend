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
import { TOTALCREATEDEVENT, TOTALREGISTEREVENT, DELETE_EVENT } from "../api/api.js";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface Event {
    _id: string;
    title: string;
    date: string;
    description: string;
}

interface DecodedToken {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
}

const UserProfile = () => {
    const [user, setUser] = useState<DecodedToken | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState(avatar);

    // For editing
    const [editingEvent_id, setEditingEvent_id] = useState<string | null>(null);
    const [editedEvent, setEditedEvent] = useState<Partial<Event>>({});
    const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
    const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("JwtToken");
            if (token) {
                const decoded: DecodedToken = jwtDecode(token);
                setUser(decoded);

                // Restore avatar
                const stored = localStorage.getItem(`avatar-${decoded._id}`);
                if (stored) setSelectedAvatar(stored);

                // Fetch events
                if (decoded.role === "admin") {
                    await axios
                        .get(TOTALCREATEDEVENT, {
                            headers: { Authorization: `Bearer ${token}` },
                            withCredentials: true,
                        })
                        .then((res) => {
                            // console.log(res.data);
                            setEvents(res.data.Events)
                        });
                } else {
                    await axios
                        .get(TOTALREGISTEREVENT, {
                            headers: { Authorization: `Bearer ${token}` },
                            withCredentials: true,
                        })
                        .then((res) => {
                            setEvents(res.data.allEvent)
                        });
                }
            }
        };
        fetchUserData();
    }, []);

    const handleAvatarSelect = (avatarSrc: string) => {
        if (!user) return;
        setSelectedAvatar(avatarSrc);
        localStorage.setItem(`avatar-${user._id}`, avatarSrc);
    };

    const handleEditEvent = (event: Event) => {
        if (editingEvent_id === event._id) {
            // Save changes
            setEvents((prev) =>
                prev.map((e) =>
                    e._id === event._id ? ({ ...e, ...editedEvent } as Event) : e
                )
            );
            setEditingEvent_id(null);
            setEditedEvent({});
        } else {
            // Enter edit mode
            setEditingEvent_id(event._id);
            setEditedEvent({ ...event });
        }
    };

    const handleDeleteEvent = async (event_id: string) => {
        try {
            setLoadingDeleteId(event_id); // show loader on clicked button
            const token = localStorage.getItem("token");

            await axios.delete(`${DELETE_EVENT}/${event_id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            setEvents((prev) => prev.filter((e) => e._id !== event_id));
            toast.success("Delete Event Successfully!!");
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Failed to delete event!");
        } finally {
            setLoadingDeleteId(null); // stop loader
        }
    };


    if (!user) return <p className="text-center mt-20">Loading profile...</p>;
    const toggleDescription = (id: string) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-purple-light/30 to-background p-4 sm:p-6 mt-20">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Profile Header */}
                <Card className="p-4 sm:p-8 shadow-lg border-purple-light/50 bg-gradient-to-r from-card to-purple-light/10">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                        <div className="relative">
                            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-purple-primary/20">
                                <AvatarImage src={selectedAvatar} alt={user.name} />
                                <AvatarFallback className="text-2xl bg-purple">
                                    {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <AvatarSelector
                                currentAvatar={selectedAvatar}
                                onAvatarSelect={handleAvatarSelect}
                            />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                                {user.name}
                            </h1>
                            <p className="text-sm sm:text-lg text-muted-foreground mb-2 sm:mb-3">
                                {user.email}
                            </p>
                            <Badge
                                variant={user.role === "admin" ? "default" : "secondary"}
                                className="text-sm px-3 py-1 sm:px-4 sm:py-1"
                            >
                                {user.role === "admin" ? "Administrator" : "User"}
                            </Badge>
                        </div>
                    </div>
                </Card>

                {/* Events Section */}
                <Card className="p-4 sm:p-6 shadow-lg border-purple-light/50">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                        {user.role === "user" ? (
                            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-purple-primary" />
                        ) : (
                            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-primary" />
                        )}
                        <h2 className="text-xl sm:text-2xl font-semibold flex flex-col sm:flex-row sm:items-center gap-2">
                            <span>
                                {user.role === "user"
                                    ? "Registered Events"
                                    : events.length === 0
                                        ? "No Event Created Yet."
                                        : "Events Manage Here"}
                            </span>

                            {user.role !== "user" && (
                                <Badge className="bg-purple-500 text-white px-3 py-1 text-sm sm:text-base w-fit sm:ml-auto">
                                    {events.length} Events Created
                                </Badge>
                            )}
                        </h2>





                    </div>

                    {
                        events.length === 0 && user.role === "user" ? "User Not Register yet." : (
                            <div className="space-y-4">
                                {events.map((event) => (
                                    <Card
                                        key={event._id}
                                        className="p-3 sm:p-4 border-purple-light/30 hover:border-purple-primary/50 transition-all"
                                        onClick={() => {
                                            (
                                                navigate(`/events/${event._id}`)
                                            )
                                        }}
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                            <div className="flex-1 space-y-2">
                                                {user.role === "admin" && editingEvent_id === event._id ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={editedEvent.title || ""}
                                                            onChange={(e) =>
                                                                setEditedEvent((prev) => ({
                                                                    ...prev,
                                                                    title: e.target.value,
                                                                }))
                                                            }
                                                            className="w-full border rounded p-2 text-sm sm:text-base"
                                                        />
                                                        <textarea
                                                            value={editedEvent.description || ""}
                                                            onChange={(e) =>
                                                                setEditedEvent((prev) => ({
                                                                    ...prev,
                                                                    description: e.target.value,
                                                                }))
                                                            }
                                                            className="w-full border rounded p-2 text-sm sm:text-base"
                                                        />
                                                        <input
                                                            type="date"
                                                            value={editedEvent.date?.split("T")[0] || ""}
                                                            onChange={(e) =>
                                                                setEditedEvent((prev) => ({
                                                                    ...prev,
                                                                    date: e.target.value,
                                                                }))
                                                            }
                                                            className="w-full border rounded p-2 text-sm sm:text-base"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <h3 className="font-semibold text-base sm:text-lg text-foreground">
                                                            {event.title}
                                                        </h3>
                                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                                            {expandedDescriptions[event._id] || event.description.length <= 100
                                                                ? event.description
                                                                : `${event.description.slice(0, 100)}...`}
                                                        </p>
                                                        {event.description.length > 100 && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // prevent navigate
                                                                    toggleDescription(event._id);
                                                                }}
                                                                className="text-purple-600 text-xs sm:text-sm font-medium mt-1 hover:underline"
                                                            >
                                                                {expandedDescriptions[event._id] ? "Read Less" : "Read More"}
                                                            </button>
                                                        )}
                                                        <p className="text-purple-primary font-medium text-sm sm:text-base">
                                                            {new Date(event.date)
                                                                .toLocaleDateString("en-GB")
                                                                .replace(/\//g, "-")}
                                                        </p>
                                                    </>
                                                )}
                                            </div>

                                            {/* Buttons only for admin */}
                                            {user.role === "admin" && (
                                                <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditEvent(event)
                                                        }}
                                                    >
                                                        {editingEvent_id === event._id ? "Save" : (
                                                            <>
                                                                <Edit className="h-4 w-4 mr-1" /> Edit
                                                            </>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteEvent(event._id);
                                                        }}
                                                        disabled={loadingDeleteId === event._id}
                                                        className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center"
                                                    >
                                                        {loadingDeleteId === event._id ? (
                                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <>
                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                Delete
                                                            </>
                                                        )}
                                                    </Button>

                                                </div>
                                            )}

                                            {/* Registered badge only for normal user */}
                                            {user.role === "user" && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-purple-primary/30 text-purple-primary mt-2 sm:mt-0"
                                                >
                                                    Registered
                                                </Badge>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )
                    }
                </Card>
            </div >
        </div >
    );
};

export default UserProfile;
