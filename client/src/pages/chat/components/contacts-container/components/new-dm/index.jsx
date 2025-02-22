import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Load from '@/lib/load';
import { animationDefaultOptions, getColor } from '@/lib/utils';
import { addDirectMessageContact, setSelectedChatData, setSelectedChatType } from '@/store/chatSlice';
import axios from 'axios';
import { Plus } from 'lucide-react';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

function NewDm() {
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);
    const [selectedColor, setSelectedColor] = useState(0);
    const dispatch = useDispatch();

    const searchContacts = async(searchTerm) => {
      try {
        if(searchTerm.length>0){
          const response = await axios.patch(`https://convonest-mn3l.onrender.com/api/v1/contacts/search`, {searchTerm}, { withCredentials: true });

          console.log(response)
          if(response.status === 200 && response.data.contacts){
            setSearchedContacts(response.data.contacts);
          }
        } else{
          setSearchedContacts([])
        }
      } catch (error) {
        console.log("Seacrh Error: ", error)
      }
    }

    const selectNewContact = (contact) => {
      dispatch(addDirectMessageContact(contact)); // Add this line
      dispatch(setSelectedChatType("contact"));
      dispatch(setSelectedChatData(contact));
      setOpenNewContactModal(false);
      setSearchedContacts([]);
  };

    return (
        <>
        <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Plus
                  size={20} className="cursor-pointer mt-2"
                  onClick={() => setOpenNewContactModal(true)}
                />
              </TooltipTrigger>
              <TooltipContent>
                Select New Contact
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
            <DialogContent className="bg-[#181920] rounded-lg border-none text-white md:w-[400px] w-[350px]  h-[400px] flex flex-col  ">
            <DialogHeader>
                <DialogTitle>Please Select a Contact</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
                <Input placeholder="Search Contacts" className="rounded-lg p-6 bg-[#2c2e3b] border-none" onChange={(e) => searchContacts(e.target.value)}/>
            </div>
            {
              searchedContacts.length > 0 && (
                <ScrollArea className="h-[250px]">
                  <div>
                    {
                      searchedContacts.map((contact) => (
                        <div key={contact._id} className='flex gap-3 items-center cursor-pointer mb-2' onClick={() => selectNewContact(contact)}>
                          <div className="w-12 h-12 relative">
                                  <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                    {contact.image ? (
                                      <AvatarImage
                                        src={contact.image}
                                        alt="profile"
                                        className="object-cover w-full h-full bg-black"
                                      />
                                    ) : (
                                      <div
                                        className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                                          selectedColor
                                        )}`}
                                      >
                                        {contact.fullName ? contact.fullName.split("").shift() : contact.email.split("").shift()}
                                      </div>
                                    )}
                                  </Avatar>
                                  </div>
                                  <div className='flex flex-col'>
                                    <span>{contact.fullName}</span>
                                    <span className='text-xs'>{contact.username}</span>
                                  </div>
                        </div>
                      ))
                    }
                  </div>
                </ScrollArea>

              )
            }
            {
                searchedContacts.length <=0 && <div className='md:flex flex-1 h-screen md:bg-[#1c1d25] md:flex-col justify-center items-center'>
                <Load/>

                <div className='text-opacity-80 text-white flex flex-col items-center mt-5 gap-5 lg:text-2xl text-xl transition-all duration-300 text-center'>
                    <h3 className='poppins-medium'>
                        Hi<span className='text-[#00BFFF]'>!</span> Search New <span className='text-[#00BFFF] '>Contacts</span>
                    </h3>
                </div>
            </div>
            }
            </DialogContent>
          </Dialog>
        </>
    )
}

export default NewDm
