import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecoilState } from "recoil";
import userAtom from "@/atoms/userAtom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { BorderTrail } from "@/components/ui/border-trail";
import { TextMorph } from "@/components/ui/text-morph";
import { Loader2 } from "lucide-react";

import UserProfileAvatar from "@/components/UserProfileAvatar";

interface Profile {
  name: string;
  username: string;
  email: string;
  bio: string;
  password: string;
}

export default function UpdateProfile() {
  const [user, setUser] = useRecoilState(userAtom);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<Profile>({
    name: user?.name,
    username: user?.username,
    email: user?.email,
    bio: user?.bio,
    password: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const baseUrl =
    import.meta.env.VITE_REACT_BACKEND_BASE_URL || "http://localhost:5000";

  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.profilePic || null
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // Create FormData to handle file upload
      const formData = new FormData();

      // Append all profile data
      Object.keys(profile).forEach((key) => {
        formData.append(key, profile[key as keyof Profile]);
      });

      // Append the file if selected
      if (selectedFile) {
        formData.append("profilePic", selectedFile);
      }

      // Submit everything to backend
      const res = await fetch(`${baseUrl}/api/users/update/${user._id}`, {
        method: "PUT",
        credentials: "include",
        body: formData, // Send as FormData instead of JSON
      });

      const responseData = await res.json();
      if (responseData.error) {
        setIsUpdating(false);
        toast.error(responseData.error);
        return;
      }

      setIsUpdating(false);
      setUser(responseData.user);
      toast.success("Profile updated successfully");
      localStorage.setItem("user-data", JSON.stringify(responseData.user));

      // Clean up preview URL
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    } catch (error) {
      toast.error("Error updating profile");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full my-10 max-w-2xl mx-auto relative overflow-hidden">
      <BorderTrail
        size={100}
        className="bg-gradient-to-l from-blue-200 via-blue-500 to-blue-200 dark:from-blue-400 dark:via-blue-500 dark:to-blue-700"
      />

      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <UserProfileAvatar
              alt={profile.username}
              imageUrl={imagePreview as string}
            />

            <div>
              <Label htmlFor="avatar">Update Avatar</Label>
              <Input
                id="avatar"
                name="profilePic"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-1"
              />
            </div>
          </div>

          {/* Rest of the form remains the same */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              placeholder="Your full name"
            />
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              placeholder="Your username"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleInputChange}
              placeholder="Your email address"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={profile.password}
              onChange={handleInputChange}
              placeholder="Enter new password"
            />
          </div>

          <div className="flex justify-between space-x-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isUpdating}
              onClick={() => {
                navigate("/");
              }}
            >
              Cancel
            </Button>
            <Button disabled={isUpdating} type="submit" className="w-full">
              {isUpdating && (
                <Loader2 className="size-4 animate-spin shrink-0" />
              )}{" "}
              <TextMorph>{isUpdating ? "Updating..." : "Update"}</TextMorph>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
